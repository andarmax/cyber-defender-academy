/**
 * SaveSystem - Backward-Compatible Schema v4.3 Migration, Validation & Auto-Repair
 */
const STORAGE_KEY = 'cda_save_state_v4';
const LEGACY_KEYS = ['cda_save_v4', 'cyber_defender_academy_save'];
const CURRENT_SCHEMA_VERSION = '4.3';

export class SaveSystem {
  static getDefaultState() {
    const today = new Date().toISOString().slice(0, 10);
    return {
      version: CURRENT_SCHEMA_VERSION,
      initialized: false,
      lastSaved: new Date().toISOString(),
      player: {
        username: 'andarmax',
        level: 1,
        xp: 0,
        credits: 1000,
        reputation: 50,
        skillPoints: 2,
        achievementPoints: 0
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
      completedMissions: [],
      missionAttempts: {},
      inventory: [],
      unlockedAchievements: [],
      certifications: [],
      frameworkProgress: {
        nistCsf: 0,
        nist80061: 0,
        cisControls: 0,
        cvss: 0,
        cwe: 0,
        mitreAttack: 0
      },
      quizStats: {
        totalAnswered: 0,
        correctAnswers: 0,
        answeredIds: []
      },
      labStats: {
        phishingSolved: 0,
        forensicsSolved: 0,
        malwareSolved: 0,
        networkHardened: 0
      },
      threatIntelStats: {
        iocsAnalyzed: 0,
        iocsCorrect: 0,
        briefsReviewed: []
      },
      siemStats: {
        totalTriaged: 0,
        truePositives: 0,
        trueNegatives: 0,
        falsePositives: 0,
        falseNegatives: 0,
        totalDecisionMs: 0
      },
      dailyChallenge: {
        date: today,
        taskType: 'COMPLETE_MISSION',
        target: 2,
        progress: 0,
        claimed: false,
        label: 'Selesaikan 2 Defensive Missions hari ini',
        rewardXP: 180,
        rewardCredits: 220
      }
    };
  }

  static toNonNegInt(val, fallback = 0) {
    const n = Number(val);
    return Number.isFinite(n) && n >= 0 ? Math.floor(n) : fallback;
  }

  static toStringArray(arr) {
    if (!Array.isArray(arr)) return [];
    return [...new Set(arr.filter(item => typeof item === 'string' && item.trim().length > 0))];
  }

  static migrateAndRepair(raw) {
    const base = this.getDefaultState();
    if (!raw || typeof raw !== 'object') return base;

    const state = {
      ...base,
      version: CURRENT_SCHEMA_VERSION,
      initialized: Boolean(raw.initialized),
      lastSaved: typeof raw.lastSaved === 'string' ? raw.lastSaved : base.lastSaved
    };

    // Player validation & repair
    const rp = raw.player && typeof raw.player === 'object' ? raw.player : {};
    state.player = {
      username: typeof rp.username === 'string' && rp.username.trim()
        ? rp.username.trim().slice(0, 20)
        : base.player.username,
      level: Math.max(1, this.toNonNegInt(rp.level, 1)),
      xp: this.toNonNegInt(rp.xp, 0),
      credits: this.toNonNegInt(rp.credits, 1000),
      reputation: Number.isFinite(Number(rp.reputation))
        ? Math.max(0, Math.min(100, Math.round(Number(rp.reputation))))
        : 50,
      skillPoints: this.toNonNegInt(rp.skillPoints, 2),
      achievementPoints: this.toNonNegInt(rp.achievementPoints, 0)
    };

    // Skills repair
    const rs = raw.skills && typeof raw.skills === 'object' ? raw.skills : {};
    for (const key of Object.keys(base.skills)) {
      state.skills[key] = Math.min(5, this.toNonNegInt(rs[key], 0));
    }

    // Arrays repair
    state.completedMissions = this.toStringArray(raw.completedMissions);
    state.inventory = this.toStringArray(raw.inventory);
    state.unlockedAchievements = this.toStringArray(raw.unlockedAchievements);
    state.certifications = this.toStringArray(raw.certifications);
    state.missionAttempts = raw.missionAttempts && typeof raw.missionAttempts === 'object'
      ? raw.missionAttempts
      : {};

    // Framework progress repair (backfill from completedMissions if upgrading from v4.2)
    const rfp = raw.frameworkProgress && typeof raw.frameworkProgress === 'object'
      ? raw.frameworkProgress
      : null;
    const baselineFw = state.completedMissions.length;
    for (const key of Object.keys(base.frameworkProgress)) {
      state.frameworkProgress[key] = rfp
        ? this.toNonNegInt(rfp[key], baselineFw)
        : baselineFw;
    }

    // Quiz stats repair
    const rq = raw.quizStats && typeof raw.quizStats === 'object' ? raw.quizStats : {};
    state.quizStats = {
      totalAnswered: this.toNonNegInt(rq.totalAnswered, 0),
      correctAnswers: this.toNonNegInt(rq.correctAnswers, 0),
      answeredIds: this.toStringArray(rq.answeredIds)
    };
    if (state.quizStats.correctAnswers > state.quizStats.totalAnswered) {
      state.quizStats.totalAnswered = state.quizStats.correctAnswers;
    }

    // Lab stats repair
    const rl = raw.labStats && typeof raw.labStats === 'object' ? raw.labStats : {};
    state.labStats = {
      phishingSolved: this.toNonNegInt(rl.phishingSolved, 0),
      forensicsSolved: this.toNonNegInt(rl.forensicsSolved, 0),
      malwareSolved: this.toNonNegInt(rl.malwareSolved, 0),
      networkHardened: this.toNonNegInt(rl.networkHardened, 0)
    };

    // Threat Intel stats repair
    const rti = raw.threatIntelStats && typeof raw.threatIntelStats === 'object' ? raw.threatIntelStats : {};
    state.threatIntelStats = {
      iocsAnalyzed: this.toNonNegInt(rti.iocsAnalyzed, 0),
      iocsCorrect: this.toNonNegInt(rti.iocsCorrect, 0),
      briefsReviewed: this.toStringArray(rti.briefsReviewed)
    };

    // SIEM stats repair
    const rsiem = raw.siemStats && typeof raw.siemStats === 'object' ? raw.siemStats : {};
    state.siemStats = {
      totalTriaged: this.toNonNegInt(rsiem.totalTriaged, 0),
      truePositives: this.toNonNegInt(rsiem.truePositives, 0),
      trueNegatives: this.toNonNegInt(rsiem.trueNegatives, 0),
      falsePositives: this.toNonNegInt(rsiem.falsePositives, 0),
      falseNegatives: this.toNonNegInt(rsiem.falseNegatives, 0),
      totalDecisionMs: this.toNonNegInt(rsiem.totalDecisionMs, 0)
    };

    // Daily Challenge repair
    const rdc = raw.dailyChallenge && typeof raw.dailyChallenge === 'object' ? raw.dailyChallenge : {};
    state.dailyChallenge = {
      date: typeof rdc.date === 'string' ? rdc.date : base.dailyChallenge.date,
      taskType: typeof (rdc.taskType || rdc.type) === 'string'
        ? (rdc.taskType || rdc.type)
        : base.dailyChallenge.taskType,
      target: Math.max(1, this.toNonNegInt(rdc.target, 2)),
      progress: this.toNonNegInt(rdc.progress, 0),
      claimed: Boolean(rdc.claimed),
      label: typeof rdc.label === 'string' && rdc.label ? rdc.label : base.dailyChallenge.label,
      rewardXP: this.toNonNegInt(rdc.rewardXP, 180),
      rewardCredits: this.toNonNegInt(rdc.rewardCredits, 220)
    };

    this.checkDailyReset(state);
    return state;
  }

  static checkDailyReset(state) {
    const today = new Date().toISOString().slice(0, 10);
    if (!state.dailyChallenge || state.dailyChallenge.date !== today) {
      const templates = [
        { taskType: 'COMPLETE_MISSION', target: 2, label: 'Selesaikan 2 Defensive Missions hari ini', rewardXP: 180, rewardCredits: 220 },
        { taskType: 'SIEM_TRIAGE', target: 4, label: 'Klasifikasikan 4 log di Mini SIEM Console hari ini', rewardXP: 190, rewardCredits: 230 },
        { taskType: 'THREAT_INTEL', target: 2, label: 'Analisis 2 indikator IOC di Threat Intel Center', rewardXP: 185, rewardCredits: 225 },
        { taskType: 'ANSWER_QUIZ', target: 5, label: 'Jawab 5 soal Cyber Quiz hari ini', rewardXP: 160, rewardCredits: 200 }
      ];
      const seed = Number(today.replace(/-/g, '')) || 1;
      const chosen = templates[seed % templates.length];
      state.dailyChallenge = {
        date: today,
        taskType: chosen.taskType,
        target: chosen.target,
        progress: 0,
        claimed: false,
        label: chosen.label,
        rewardXP: chosen.rewardXP,
        rewardCredits: chosen.rewardCredits
      };
    }
  }

  static load() {
    try {
      let rawStr = localStorage.getItem(STORAGE_KEY);
      if (!rawStr) {
        for (const legacyKey of LEGACY_KEYS) {
          rawStr = localStorage.getItem(legacyKey);
          if (rawStr) break;
        }
      }
      if (!rawStr) return this.getDefaultState();
      const parsed = JSON.parse(rawStr);
      const migrated = this.migrateAndRepair(parsed);
      this.save(migrated);
      return migrated;
    } catch (err) {
      console.warn('SaveSystem recovery triggered:', err);
      return this.getDefaultState();
    }
  }

  static save(state) {
    try {
      const cleanState = this.migrateAndRepair(state);
      cleanState.lastSaved = new Date().toISOString();
      Object.assign(state, cleanState);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanState));
      return true;
    } catch (err) {
      console.error('Failed to persist save state:', err);
      return false;
    }
  }

  static exportJSON(state) {
    const clean = this.migrateAndRepair(state);
    const blob = new Blob([JSON.stringify(clean, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cda-save-${clean.player.username}-v${CURRENT_SCHEMA_VERSION}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  static reset() {
    localStorage.removeItem(STORAGE_KEY);
    for (const legacyKey of LEGACY_KEYS) {
      localStorage.removeItem(legacyKey);
    }
    return this.getDefaultState();
  }
}

export const SaveManager = SaveSystem;