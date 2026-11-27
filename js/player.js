/**
 * PlayerManager - Career Ranks, Certification Roadmap, Rewards & Real-Time SOC Metrics
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

export const CERTIFICATION_TRACKS = [
  {
    id: 'cert_google_cyber',
    name: 'Google Cybersecurity Certificate',
    tier: 'Foundational Blue Team',
    badge: 'G-CYBER',
    rewardXP: 250,
    rewardCredits: 300,
    requirementsText: 'Level 2 • 5 Misi • 10 Jawaban Quiz Benar',
    evaluate: (st) => ({
      pct: Math.min(100, Math.round(
        ((Math.min(st.player.level, 2) / 2) * 34) +
        ((Math.min(st.completedMissions.length, 5) / 5) * 33) +
        ((Math.min(st.quizStats.correctAnswers, 10) / 10) * 33)
      )),
      met: st.player.level >= 2 && st.completedMissions.length >= 5 && st.quizStats.correctAnswers >= 10
    })
  },
  {
    id: 'cert_ms_sc900',
    name: 'Microsoft SC-900',
    tier: 'Security, Compliance & Identity',
    badge: 'SC-900',
    rewardXP: 350,
    rewardCredits: 400,
    requirementsText: 'Level 3 • 8 Misi • 15 Jawaban Quiz Benar',
    evaluate: (st) => ({
      pct: Math.min(100, Math.round(
        ((Math.min(st.player.level, 3) / 3) * 34) +
        ((Math.min(st.completedMissions.length, 8) / 8) * 33) +
        ((Math.min(st.quizStats.correctAnswers, 15) / 15) * 33)
      )),
      met: st.player.level >= 3 && st.completedMissions.length >= 8 && st.quizStats.correctAnswers >= 15
    })
  },
  {
    id: 'cert_comptia_secplus',
    name: 'CompTIA Security+',
    tier: 'Core Enterprise Security',
    badge: 'SEC+',
    rewardXP: 500,
    rewardCredits: 600,
    requirementsText: 'Level 5 • 15 Misi • 25 Quiz Benar • 1 Network Defense Lab',
    evaluate: (st) => ({
      pct: Math.min(100, Math.round(
        ((Math.min(st.player.level, 5) / 5) * 25) +
        ((Math.min(st.completedMissions.length, 15) / 15) * 30) +
        ((Math.min(st.quizStats.correctAnswers, 25) / 25) * 25) +
        ((Math.min(st.labStats.networkHardened, 1) / 1) * 20)
      )),
      met: st.player.level >= 5 && st.completedMissions.length >= 15
        && st.quizStats.correctAnswers >= 25 && st.labStats.networkHardened >= 1
    })
  },
  {
    id: 'cert_btl1',
    name: 'Blue Team Level 1 (BTL1)',
    tier: 'Practical SOC Defender',
    badge: 'BTL1',
    rewardXP: 700,
    rewardCredits: 850,
    requirementsText: 'Level 7 • 20 Misi • 10 SIEM Triaged • 4 IOCs Analyzed',
    evaluate: (st) => ({
      pct: Math.min(100, Math.round(
        ((Math.min(st.player.level, 7) / 7) * 25) +
        ((Math.min(st.completedMissions.length, 20) / 20) * 25) +
        ((Math.min(st.siemStats.totalTriaged, 10) / 10) * 25) +
        ((Math.min(st.threatIntelStats.iocsAnalyzed, 4) / 4) * 25)
      )),
      met: st.player.level >= 7 && st.completedMissions.length >= 20
        && st.siemStats.totalTriaged >= 10 && st.threatIntelStats.iocsAnalyzed >= 4
    })
  },
  {
    id: 'cert_ms_sc200',
    name: 'Microsoft SC-200',
    tier: 'Security Operations Analyst',
    badge: 'SC-200',
    rewardXP: 950,
    rewardCredits: 1100,
    requirementsText: 'Level 10 • 30 Misi • 20 SIEM Triaged • 3 Threat Briefs',
    evaluate: (st) => ({
      pct: Math.min(100, Math.round(
        ((Math.min(st.player.level, 10) / 10) * 25) +
        ((Math.min(st.completedMissions.length, 30) / 30) * 25) +
        ((Math.min(st.siemStats.totalTriaged, 20) / 20) * 25) +
        ((Math.min(st.threatIntelStats.briefsReviewed.length, 3) / 3) * 25)
      )),
      met: st.player.level >= 10 && st.completedMissions.length >= 30
        && st.siemStats.totalTriaged >= 20 && st.threatIntelStats.briefsReviewed.length >= 3
    })
  },
  {
    id: 'cert_cissp_sim',
    name: 'CISSP (Simulatif)',
    tier: 'Executive Governance & Architecture',
    badge: 'CISSP-SIM',
    rewardXP: 1500,
    rewardCredits: 2000,
    requirementsText: 'Level 14 • 40 Misi • 40 Quiz Benar • Skill GRC Lv.3',
    evaluate: (st) => ({
      pct: Math.min(100, Math.round(
        ((Math.min(st.player.level, 14) / 14) * 25) +
        ((Math.min(st.completedMissions.length, 40) / 40) * 25) +
        ((Math.min(st.quizStats.correctAnswers, 40) / 40) * 25) +
        ((Math.min(st.skills.grc || 0, 3) / 3) * 25)
      )),
      met: st.player.level >= 14 && st.completedMissions.length >= 40
        && st.quizStats.correctAnswers >= 40 && (st.skills.grc || 0) >= 3
    })
  }
];

export class PlayerManager {
  constructor(gameOrState) {
    if (gameOrState && gameOrState.state && gameOrState.state.player) {
      this.game = gameOrState;
      this.state = gameOrState.state;
    } else {
      this.game = null;
      this.state = gameOrState || {};
    }
  }

  getXPForNextLevel(level = this.state.player.level) {
    return 500 + ((Math.max(1, level) - 1) * 150);
  }

  getCurrentRank(level = this.state.player.level) {
    let current = CAREER_RANKS[0];
    for (const rank of CAREER_RANKS) {
      if (level >= rank.minLevel) current = rank;
    }
    return current;
  }

  getNextRank(level = this.state.player.level) {
    for (const rank of CAREER_RANKS) {
      if (level < rank.minLevel) return rank;
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
    posture += (this.getSkillLevel('networkSecurity') * 3)
      + (this.getSkillLevel('securityOperations') * 3)
      + (this.getSkillLevel('incidentResponse') * 2)
      + (this.getSkillLevel('grc') * 2);
    posture += Math.round((this.state.player.reputation - 50) * 0.2);
    return Math.max(0, Math.min(100, Math.round(posture)));
  }

  getSOCMetrics() {
    const st = this.state;
    const siem = st.siemStats;
    const ti = st.threatIntelStats;
    const missionsDone = st.completedMissions.length;
    const secOpsSkill = this.getSkillLevel('securityOperations');
    const irSkill = this.getSkillLevel('incidentResponse');
    const ctiSkill = this.getSkillLevel('threatIntelligence');

    // 1. MTTD (Mean Time To Detect in simulated minutes)
    const avgDecisionSec = siem.totalTriaged > 0
      ? Math.min(45, (siem.totalDecisionMs / siem.totalTriaged) / 1000)
      : 18;
    const mttdRaw = 16.5 - (secOpsSkill * 1.1) - (ctiSkill * 0.8) - Math.min(4.5, missionsDone * 0.08) + ((avgDecisionSec - 12) * 0.12);
    const mttdMinutes = Math.max(1.8, Math.min(24.0, Number(mttdRaw.toFixed(1))));

    // 2. MTTR (Mean Time To Respond in simulated minutes)
    const labsTotal = st.labStats.phishingSolved + st.labStats.forensicsSolved + st.labStats.malwareSolved + st.labStats.networkHardened;
    const mttrRaw = 44.0 - (irSkill * 3.2) - (secOpsSkill * 1.8) - Math.min(12.0, missionsDone * 0.2) - Math.min(6.0, labsTotal * 0.5);
    const mttrMinutes = Math.max(5.5, Math.min(60.0, Number(mttrRaw.toFixed(1))));

    // 3. Incident Containment Rate (%)
    const totalAttempts = Object.values(st.missionAttempts || {}).reduce((acc, v) => acc + Number(v || 0), 0);
    const effectiveAttempts = Math.max(missionsDone, totalAttempts);
    const siemCaught = siem.truePositives;
    const siemMissed = siem.falseNegatives;
    const containmentNumerator = missionsDone + labsTotal + siemCaught;
    const containmentDenominator = effectiveAttempts + labsTotal + siemCaught + siemMissed;
    const containmentRate = containmentDenominator > 0
      ? Math.min(100, Math.round((containmentNumerator / containmentDenominator) * 1000) / 10)
      : 100.0;

    // 4. False Positive Rate (%)
    const benignEvaluated = siem.trueNegatives + siem.falsePositives;
    const falsePositiveRate = benignEvaluated > 0
      ? Math.round((siem.falsePositives / benignEvaluated) * 1000) / 10
      : 0.0;

    // 5. Threat Handling Score (0 - 100)
    const tiAccuracy = ti.iocsAnalyzed > 0 ? (ti.iocsCorrect / ti.iocsAnalyzed) * 100 : 75;
    const posture = this.getSecurityPosture();
    const handlingScore = Math.max(0, Math.min(100, Math.round(
      (containmentRate * 0.35) +
      ((100 - falsePositiveRate) * 0.25) +
      (posture * 0.25) +
      (tiAccuracy * 0.15)
    )));

    return {
      mttdMinutes,
      mttrMinutes,
      containmentRate,
      falsePositiveRate,
      handlingScore
    };
  }

  evaluateCertifications() {
    if (!Array.isArray(this.state.certifications)) {
      this.state.certifications = [];
    }
    const owned = new Set(this.state.certifications);
    let newlyEarned = false;

    for (const cert of CERTIFICATION_TRACKS) {
      if (owned.has(cert.id)) continue;
      const status = cert.evaluate(this.state);
      if (status.met) {
        owned.add(cert.id);
        this.state.certifications.push(cert.id);
        this.state.player.xp += cert.rewardXP;
        this.state.player.credits += cert.rewardCredits;
        newlyEarned = true;
        if (this.game?.ui?.toast) {
          this.game.ui.toast(`🎓 Sertifikasi Diraih: ${cert.name} (+${cert.rewardXP} XP, +₵ ${cert.rewardCredits})!`, 'success');
        }
      }
    }

    // Handle any level-ups triggered by certification XP
    const p = this.state.player;
    while (p.xp >= this.getXPForNextLevel(p.level)) {
      p.xp -= this.getXPForNextLevel(p.level);
      p.level += 1;
      p.skillPoints += 1;
    }

    return newlyEarned;
  }

  grantRewards({ xp = 0, credits = 0, reputation = 0, skillPoints = 0 } = {}) {
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

    this.evaluateCertifications();
    return { finalXP, finalCredits, leveledUp };
  }
}