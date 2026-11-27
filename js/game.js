/**
 * Cyber Defender Academy - Main Game Controller
 */
import { SoundEngine } from './audio.js';
import { SaveSystem } from './save.js';
import { PlayerManager } from './player.js';
import { MissionManager } from './missions.js';
import { ThreatIntelManager } from './threatintel.js';
import { SIEMConsoleManager } from './siem.js';
import { QuizManager } from './quiz.js';
import { SkillTreeManager } from './skilltree.js';
import { InventoryManager } from './inventory.js';
import { AchievementManager } from './achievements.js';
import { LeaderboardManager } from './leaderboard.js';
import { UIManager } from './ui.js';

class CyberDefenderGame {
  constructor() {
    this.sound = new SoundEngine();
    this.state = SaveSystem.load();
    this.player = new PlayerManager(this);
    this.ui = new UIManager(this);

    this.missions = null;
    this.threatIntel = null;
    this.siem = null;
    this.quiz = null;
    this.skillTree = null;
    this.inventory = null;
    this.achievements = null;
    this.leaderboard = null;
  }

  async boot() {
    try {
      this.ui.initParticles();
      this.ui.setLoadingProgress(20, 'Loading Defensive Threat Intelligence...');

      const [missionsData, questionsData, achievementsData, itemsData] = await Promise.all([
        this.fetchJSON('./data/missions.json', []),
        this.fetchJSON('./data/questions.json', []),
        this.fetchJSON('./data/achievements.json', []),
        this.fetchJSON('./data/items.json', [])
      ]);

      this.ui.setLoadingProgress(65, 'Initializing SOC, SIEM & CTI Modules...');

      this.missions = new MissionManager(this, missionsData);
      this.threatIntel = new ThreatIntelManager(this);
      this.siem = new SIEMConsoleManager(this);
      this.quiz = new QuizManager(this, questionsData);
      this.skillTree = new SkillTreeManager(this);
      this.inventory = new InventoryManager(this, itemsData);
      this.achievements = new AchievementManager(this, achievementsData);
      this.leaderboard = new LeaderboardManager(this);

      this.ui.setLoadingProgress(95, 'Verifying LocalStorage Schema v4.3...');
      this.bindGlobalEvents();
      this.ui.setLoadingProgress(100, 'Defensive Sandbox Ready.');
    } catch (err) {
      console.error('Boot error:', err);
      this.ui.setLoadingProgress(100, 'Fallback Sandbox Active.');
    } finally {
      setTimeout(() => {
        this.ui.hideLoading();
        if (!this.state.initialized) {
          this.ui.showOnboarding();
        } else {
          this.startSession();
        }
      }, 300);
    }
  }

  async fetchJSON(path, fallback) {
    try {
      const res = await fetch(path, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`Fallback triggered for ${path}:`, err);
      return fallback;
    }
  }

  startSession() {
    this.ui.showAppShell();
    this.player.evaluateCertifications();
    this.achievements.evaluateAll();
    this.refreshAllViews();
    this.autoSave(false);
  }

  refreshAllViews() {
    this.ui.renderHUD();
    this.ui.renderDashboard();
    this.missions?.renderMissionList();
    this.missions?.renderLab(this.missions.currentLab || 'phishing');
    this.threatIntel?.render();
    this.siem?.render();
    this.quiz?.renderQuizHome();
    this.skillTree?.render();
    this.inventory?.render();
    this.achievements?.render();
    this.leaderboard?.render();
  }

  advanceDailyProgress(taskType, amount = 1) {
    SaveSystem.checkDailyReset(this.state);
    const dc = this.state.dailyChallenge;
    if (dc && dc.taskType === taskType && !dc.claimed) {
      dc.progress = Math.min(dc.target, dc.progress + amount);
      if (dc.progress >= dc.target) {
        this.ui.toast('Daily Directive siap diklaim di Dashboard!', 'success');
      }
    }
  }

  autoSave(notify = false) {
    const ok = SaveSystem.save(this.state);
    if (ok && notify) {
      this.sound.click();
      this.ui.toast('Progress tersimpan ke LocalStorage.', 'success');
    }
  }

  bindGlobalEvents() {
    // Onboarding
    document.getElementById('btn-start-career')?.addEventListener('click', () => {
      const input = document.getElementById('agent-name-input');
      const name = (input?.value || '').trim() || 'andarmax';
      this.state.player.username = name.slice(0, 20);
      this.state.initialized = true;
      this.sound.success();
      this.ui.hideOnboarding();
      this.startSession();
      this.ui.toast(`Selamat bertugas, ${this.state.player.username}!`, 'success');
    });

    // Navigation Tabs
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        this.sound.click();
        this.ui.switchView(btn.dataset.view);
      });
    });

    // Lab Tabs
    document.querySelectorAll('.lab-tab[data-lab]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.sound.click();
        document.querySelectorAll('.lab-tab[data-lab]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.missions?.renderLab(btn.dataset.lab);
      });
    });

    // Mission Filters & Modal Close
    document.getElementById('mission-category-filter')?.addEventListener('change', () => this.missions?.renderMissionList());
    document.getElementById('mission-status-filter')?.addEventListener('change', () => this.missions?.renderMissionList());
    document.getElementById('btn-close-mission')?.addEventListener('click', () => {
      this.sound.click();
      this.ui.closeMissionModal();
    });

    // HUD Audio & Save Controls
    document.getElementById('btn-toggle-sound')?.addEventListener('click', (e) => {
      const on = typeof this.sound.toggleSFX === 'function' ? this.sound.toggleSFX() : this.sound.toggleSfx();
      e.currentTarget.textContent = on ? '🔊' : '🔇';
    });

    document.getElementById('btn-toggle-bgm')?.addEventListener('click', (e) => {
      const on = typeof this.sound.toggleBGM === 'function' ? this.sound.toggleBGM() : this.sound.toggleAmbient();
      e.currentTarget.textContent = on ? '🎶' : '🎵';
      this.ui.toast(on ? 'Ambient Synth aktif' : 'Ambient Synth nonaktif');
    });

    document.getElementById('btn-save-now')?.addEventListener('click', () => this.autoSave(true));

    // SOC Scan Logs
    document.getElementById('btn-refresh-soc')?.addEventListener('click', () => {
      this.sound.click();
      this.ui.renderSOCAlerts(true);
    });

    // Export / Import / Reset Save
    document.getElementById('btn-export-save')?.addEventListener('click', () => {
      this.sound.click();
      SaveSystem.exportJSON(this.state);
    });

    document.getElementById('input-import-save')?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const imported = JSON.parse(reader.result);
          this.state = SaveSystem.migrateAndRepair(imported);
          this.player = new PlayerManager(this);
          this.autoSave(false);
          this.refreshAllViews();
          this.sound.success();
          this.ui.toast('Save data berhasil dimigrasi & diimpor!', 'success');
        } catch {
          this.sound.alert();
          this.ui.toast('File JSON tidak valid!', 'alert');
        }
      };
      reader.readAsText(file);
    });

    document.getElementById('btn-reset-save')?.addEventListener('click', () => {
      if (confirm('Hapus seluruh progres karier dan mulai ulang dari Intern?')) {
        SaveSystem.reset();
        location.reload();
      }
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const game = new CyberDefenderGame();
  window.CDA = game;
  game.boot();
});