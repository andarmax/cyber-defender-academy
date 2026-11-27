/**
 * PlayerManager - Career Ranks, Leveling, Rewards & Security Posture
 */
export const CAREER_RANKS = [
  { id: 'intern', title: 'Intern', minLevel: 1 },
  { id: 'junior_analyst', title: 'Junior Analyst', minLevel: 3 },
  { id: 'security_analyst', title: 'Security Analyst', minLevel: 5 },
  { id: 'soc_analyst', title: 'SOC Analyst', minLevel: 7 },
  { id: 'security_engineer', title: 'Security Engineer', minLevel: 9 },
  { id: 'incident_responder', title: 'Incident Responder', minLevel: 11 },
  { id: 'security_architect', title: 'Security Architect', minLevel: 13 },
  { id: 'ciso', title: 'CISO', minLevel: 15 }
];

export class PlayerManager {
  constructor(gameOrState) {
    // Mendukung pemanggilan baik dengan `new PlayerManager(this)` maupun `new PlayerManager(state)`
    if (gameOrState && gameOrState.state && gameOrState.state.player) {
      this.game = gameOrState;
      this.state = gameOrState.state;
    } else {
      this.game = null;
      this.state = gameOrState || {};
    }
    this.ensurePlayerSchema();
  }

  ensurePlayerSchema() {
    if (!this.state.player || typeof this.state.player !== 'object') {
      this.state.player = {};
    }
    const p = this.state.player;
    p.username = typeof p.username === 'string' && p.username.trim() ? p.username : 'andarmax';
    p.level = Number.isFinite(p.level) && p.level >= 1 ? Math.floor(p.level) : 1;
    p.xp = Number.isFinite(p.xp) && p.xp >= 0 ? Math.floor(p.xp) : 0;
    p.credits = Number.isFinite(p.credits) ? Math.floor(p.credits) : 1000;
    p.reputation = Number.isFinite(p.reputation)
      ? Math.max(0, Math.min(100, Math.round(p.reputation)))
      : 50;
    p.skillPoints = Number.isFinite(p.skillPoints) && p.skillPoints >= 0 ? Math.floor(p.skillPoints) : 2;
    p.achievementPoints = Number.isFinite(p.achievementPoints) && p.achievementPoints >= 0
      ? Math.floor(p.achievementPoints)
      : 0;

    if (!this.state.skills || typeof this.state.skills !== 'object') {
      this.state.skills = {};
    }
    if (!Array.isArray(this.state.inventory)) {
      this.state.inventory = [];
    }
  }

  getXPForNextLevel(level = this.state.player.level) {
    return 500 + ((Math.max(1, level) - 1) * 150);
  }

  getCurrentRank(level = this.state.player.level) {
    let current = CAREER_RANKS[0];
    for (const rank of CAREER_RANKS) {
      if (level >= rank.minLevel) {
        current = rank;
      }
    }
    return current;
  }

  getNextRank(level = this.state.player.level) {
    for (const rank of CAREER_RANKS) {
      if (level < rank.minLevel) {
        return rank;
      }
    }
    return null;
  }

  getSkillLevel(key) {
    return Number(this.state.skills?.[key] || 0);
  }

  getSecurityPosture() {
    let posture = 50;
    posture += Math.min(20, (this.state.player.level - 1) * 2);
    posture += Math.min(15, (this.state.inventory?.length || 0) * 3);

    const netLvl = this.getSkillLevel('networkSecurity');
    const secOpsLvl = this.getSkillLevel('securityOperations');
    const irLvl = this.getSkillLevel('incidentResponse');
    const grcLvl = this.getSkillLevel('grc');

    posture += (netLvl * 3) + (secOpsLvl * 3) + (irLvl * 2) + (grcLvl * 2);
    posture += Math.round((this.state.player.reputation - 50) * 0.2);

    return Math.max(0, Math.min(100, Math.round(posture)));
  }

  grantRewards({ xp = 0, credits = 0, reputation = 0, skillPoints = 0 } = {}) {
    this.ensurePlayerSchema();
    const p = this.state.player;

    const awarenessLvl = this.getSkillLevel('securityAwareness');
    const grcLvl = this.getSkillLevel('grc');
    const cloudLvl = this.getSkillLevel('cloudSecurity');

    const xpMult = 1 + (awarenessLvl * 0.04) + (grcLvl * 0.03);
    const credMult = 1 + (grcLvl * 0.05) + (cloudLvl * 0.03);

    const finalXP = xp > 0 ? Math.max(1, Math.round(xp * xpMult)) : 0;
    const finalCredits = credits > 0 ? Math.max(0, Math.round(credits * credMult)) : 0;

    p.xp += finalXP;
    p.credits = Math.max(0, p.credits + finalCredits);
    p.reputation = Math.max(0, Math.min(100, p.reputation + reputation));
    p.skillPoints += Math.max(0, skillPoints);

    let leveledUp = false;
    while (p.xp >= this.getXPForNextLevel(p.level)) {
      p.xp -= this.getXPForNextLevel(p.level);
      p.level += 1;
      p.skillPoints += 1;
      leveledUp = true;
    }

    if (leveledUp && this.game?.ui?.toast) {
      const rank = this.getCurrentRank(p.level);
      this.game.ui.toast(`🎉 Level Up! Sekarang Level ${p.level} (${rank.title}) — +1 Skill Point!`, 'success');
    }

    return { finalXP, finalCredits, leveledUp };
  }
}
