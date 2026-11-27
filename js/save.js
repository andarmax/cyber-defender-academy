/**
 * SaveSystem - LocalStorage Persistence, Auto-Save & Daily Challenge Reset
 */
const STORAGE_KEY = 'cda_save_state_v1';

export class SaveSystem {
  static getTodayKey() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  static getDefaultState() {
    return {
      version: '1.0.0',
      initialized: false,
      lastSaved: new Date().toISOString(),
      player: {
        username: 'Agent',
        level: 1,
        xp: 0,
        credits: 1000,
        reputation: 50,
        skillPoints: 2,
        achievementPoints: 0,
        rankIndex: 0
      },
      completedMissions: [],
      quizStats: {
        answeredIds: [],
        totalAnswered: 0,
        correctAnswers: 0
      },
      skills: {
        networkSecurity: 0,
        cloudSecurity: 0,
        securityOperations: 0,
        digitalForensics: 0,
        incidentResponse: 0,
        securityAwareness: 0,
        threatIntelligence: 0,
        grc: 0
      },
      inventory: ['fw_basic'],
      equippedItems: ['fw_basic'],
      unlockedAchievements: [],
      dailyChallenge: {
        dateKey: this.getTodayKey(),
        taskType: 'COMPLETE_MISSION',
        target: 2,
        progress: 0,
        claimed: false,
        rewardXP: 350,
        rewardCredits: 450
      },
      labStats: {
        phishingSolved: 0,
        forensicsSolved: 0,
        malwareSolved: 0,
        networkHardened: 0
      }
    };
  }

  static load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return this.getDefaultState();
      const parsed = JSON.parse(raw);
      const merged = {
        ...this.getDefaultState(),
        ...parsed,
        player: { ...this.getDefaultState().player, ...(parsed.player || {}) },
        quizStats: { ...this.getDefaultState().quizStats, ...(parsed.quizStats || {}) },
        skills: { ...this.getDefaultState().skills, ...(parsed.skills || {}) },
        labStats: { ...this.getDefaultState().labStats, ...(parsed.labStats || {}) }
      };
      this.checkDailyReset(merged);
      return merged;
    } catch (err) {
      console.error('Failed to load save state:', err);
      return this.getDefaultState();
    }
  }

  static save(state) {
    try {
      state.lastSaved = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (err) {
      console.error('Failed to save state:', err);
      return false;
    }
  }

  static checkDailyReset(state) {
    const today = this.getTodayKey();
    if (!state.dailyChallenge || state.dailyChallenge.dateKey !== today) {
      const templates = [
        { taskType: 'COMPLETE_MISSION', label: 'Selesaikan 2 Misi Pertahanan Hari Ini', target: 2, rewardXP: 350, rewardCredits: 450 },
        { taskType: 'ANSWER_QUIZ', label: 'Jawab Benar 5 Soal Cyber Quiz Hari Ini', target: 5, rewardXP: 300, rewardCredits: 400 },
        { taskType: 'SOLVE_LAB', label: 'Selesaikan 2 Simulasi di Cyber Labs Hari Ini', target: 2, rewardXP: 320, rewardCredits: 420 }
      ];
      const pick = templates[new Date().getDate() % templates.length];
      state.dailyChallenge = {
        dateKey: today,
        ...pick,
        progress: 0,
        claimed: false
      };
    }
  }

  static exportJSON(state) {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyber-defender-save-${this.getTodayKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  static reset() {
    localStorage.removeItem(STORAGE_KEY);
    return this.getDefaultState();
  }
}
