/**
 * UIManager - HUD, Dashboard, Particle Canvas, Modals & Notifications
 */
import { CAREER_RANKS } from './player.js';

export class UIManager {
  constructor(game) {
    this.game = game;
    this.socAlerts = this.generateSOCAlerts();
  }

  initParticles() {
    const canvas = document.getElementById('bg-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const dots = Array.from({ length: 42 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 1.8 + 0.6
    }));

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(0, 240, 255, 0.35)';
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > width) d.vx *= -1;
        if (d.y < 0 || d.y > height) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(tick);
    };
    tick();
  }

  setLoadingProgress(pct, statusText) {
    const bar = document.getElementById('loader-progress');
    const st = document.getElementById('loader-status');
    if (bar) bar.style.width = `${pct}%`;
    if (st && statusText) st.textContent = statusText;
  }

  hideLoading() {
    document.getElementById('loading-screen')?.classList.add('hidden');
  }

  showOnboarding() {
    document.getElementById('onboarding-modal')?.classList.remove('hidden');
  }

  hideOnboarding() {
    document.getElementById('onboarding-modal')?.classList.add('hidden');
  }

  showAppShell() {
    document.getElementById('app-shell')?.classList.remove('hidden');
  }

  switchView(viewName) {
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.toggle('active', sec.id === `view-${viewName}`);
    });
  }

  renderHUD() {
    const p = this.game.state.player;
    const rank = this.game.player.getCurrentRank();
    const neededXP = this.game.player.getXPForNextLevel(p.level);
    const pct = Math.min(100, Math.round((p.xp / neededXP) * 100));

    document.getElementById('hud-rank-badge').textContent = rank.title.toUpperCase();
    document.getElementById('hud-username').textContent = p.username;
    document.getElementById('hud-level').textContent = `LVL ${p.level}`;
    document.getElementById('hud-xp-bar').style.width = `${pct}%`;
    document.getElementById('hud-xp-text').textContent = `${p.xp} / ${neededXP}`;
    document.getElementById('hud-credits').textContent = `₵ ${p.credits.toLocaleString()}`;
    document.getElementById('hud-reputation').textContent = `${p.reputation}%`;
    document.getElementById('hud-sp').textContent = p.skillPoints;
  }

  renderDashboard() {
    const st = this.game.state;
    const p = st.player;
    const currRank = this.game.player.getCurrentRank();
    const nextRank = this.game.player.getNextRank();

    // Career Roadmap
    const roadmapEl = document.getElementById('career-roadmap-track');
    const nextReqEl = document.getElementById('career-next-req');
    if (nextReqEl) {
      nextReqEl.textContent = nextRank
        ? `Next Rank: ${nextRank.title} (Level ${nextRank.minLevel})`
        : 'Peak Rank Achieved: Chief Information Security Officer (CISO)';
    }
    if (roadmapEl) {
      roadmapEl.innerHTML = CAREER_RANKS.map(r => {
        const isCurrent = r.id === currRank.id;
        const isUnlocked = p.level >= r.minLevel;
        return `
          <div class="career-node ${isCurrent ? 'current' : isUnlocked ? 'unlocked' : ''}">
            <div>${r.title}</div>
            <div class="mono-text">LVL ${r.minLevel}+</div>
          </div>
        `;
      }).join('');
    }

    // KPIs
    const totalMissions = this.game.missions ? this.game.missions.missions.length : 50;
    document.getElementById('kpi-missions').textContent = `${st.completedMissions.length} / ${totalMissions}`;

    const qTotal = st.quizStats.totalAnswered;
    const qAcc = qTotal > 0 ? Math.round((st.quizStats.correctAnswers / qTotal) * 100) : 0;
    document.getElementById('kpi-quiz').textContent = `${qAcc}%`;
    document.getElementById('kpi-quiz-sub').textContent = `${st.quizStats.correctAnswers}/${qTotal} Correct`;

    const posture = this.game.player.getSecurityPosture();
    document.getElementById('kpi-posture').textContent = `${posture} / 100`;

    const threatBadge = document.getElementById('soc-threat-level');
    if (threatBadge) {
      if (posture >= 75) {
        threatBadge.textContent = 'LOW (DEFENDED)';
        threatBadge.className = 'threat-badge low';
      } else if (posture >= 55) {
        threatBadge.textContent = 'GUARDED (ELEVATED)';
        threatBadge.className = 'threat-badge medium';
      } else {
        threatBadge.textContent = 'HIGH ALERT';
        threatBadge.className = 'threat-badge high';
      }
    }

    document.getElementById('kpi-ap').textContent = `${p.achievementPoints} AP`;
    document.getElementById('kpi-ach-count').textContent = `${st.unlockedAchievements.length} Unlocked`;

    // Daily Challenge
    this.renderDailyChallenge();
    this.renderSOCAlerts(false);
  }

  renderDailyChallenge() {
    const box = document.getElementById('daily-challenge-box');
    const dc = this.game.state.dailyChallenge;
    if (!box || !dc) return;

    const pct = Math.min(100, Math.round((dc.progress / dc.target) * 100));
    const ready = dc.progress >= dc.target && !dc.claimed;

    box.innerHTML = `
      <p style="font-weight:600; margin-bottom:0.5rem;">${dc.label}</p>
      <div class="xp-mini-wrap" style="width:100%; height:8px; margin-bottom:0.5rem;">
        <div class="xp-mini-fill" style="width:${pct}%;"></div>
      </div>
      <div class="card-title-row">
        <span class="mono-text">Progress: ${dc.progress} / ${dc.target}</span>
        <span class="mono-text neon-green">+${dc.rewardXP} XP | +₵ ${dc.rewardCredits}</span>
      </div>
      <button id="btn-claim-daily" class="btn ${ready ? 'btn-success' : 'btn-outline'} btn-sm" ${!ready ? 'disabled' : ''}>
        ${dc.claimed ? '✅ Reward Diklaim Hari Ini' : ready ? '🎁 Klaim Daily Reward' : 'Sedang Berlangsung'}
      </button>
    `;

    const claimBtn = document.getElementById('btn-claim-daily');
    if (claimBtn && ready) {
      claimBtn.addEventListener('click', () => {
        dc.claimed = true;
        this.game.player.grantRewards({ xp: dc.rewardXP, credits: dc.rewardCredits, reputation: 2 });
        this.game.sound.success();
        this.game.autoSave(false);
        this.game.refreshAllViews();
        this.toast('Daily Directive reward berhasil diklaim!', 'success');
      });
    }
  }

  generateSOCAlerts() {
    return [
      { sev: 'critical', title: 'Anomalous Outbound DNS Query Pattern', desc: 'Terdeteksi lonjakan query TXT pada subnet internal simulasi.' },
      { sev: 'warning', title: 'Multiple Failed Auth Attempts on Gateway', desc: 'Pembatasan rate-limit aktif pada perimeter login simulasi.' },
      { sev: 'info', title: 'Endpoint Agent Heartbeat Verified', desc: 'Seluruh host terpantau melaporkan status telemetri normal.' }
    ];
  }

  renderSOCAlerts(rotate = false) {
    const feed = document.getElementById('soc-alert-feed');
    if (!feed) return;
    if (rotate) {
      this.socAlerts.unshift(this.socAlerts.pop());
      this.toast('Telemetri SOC diperbarui.', 'info');
    }

    feed.innerHTML = this.socAlerts.map(a => `
      <div class="soc-alert-item ${a.sev}">
        <div>
          <strong style="font-size:0.86rem;">${a.title}</strong>
          <p class="subtitle" style="font-size:0.78rem;">${a.desc}</p>
        </div>
        <button class="btn btn-sm btn-outline btn-jump-missions">Tindak Lanjuti</button>
      </div>
    `).join('');

    feed.querySelectorAll('.btn-jump-missions').forEach(btn => {
      btn.addEventListener('click', () => {
        this.game.sound.click();
        this.switchView('missions');
      });
    });
  }

  closeMissionModal() {
    document.getElementById('mission-modal')?.classList.add('hidden');
  }

  toast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => el.remove(), 3400);
  }
}
