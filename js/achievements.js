/**
 * AchievementManager - Unlockable Badges, Achievement Points & Bonus Rewards
 */
export class AchievementManager {
  constructor(game, achievementsData = []) {
    this.game = game;
    this.achievements = Array.isArray(achievementsData) && achievementsData.length > 0
      ? achievementsData
      : this.getFallbackAchievements();
  }

  getFallbackAchievements() {
    return [
      {
        id: 'ach_first_login',
        title: 'First Login',
        desc: 'Memulai karier defensif di Cyber Defender Academy.',
        ap: 50,
        bonusCredits: 150,
        check: (st) => Boolean(st.initialized)
      },
      {
        id: 'ach_threat_hunter',
        title: 'Threat Hunter',
        desc: 'Menyelesaikan minimal 5 misi pertahanan atau lab forensik/phishing.',
        ap: 100,
        bonusCredits: 250,
        check: (st) => st.completedMissions.length >= 5 || (st.labStats.phishingSolved + st.labStats.forensicsSolved) >= 3
      },
      {
        id: 'ach_malware_hunter',
        title: 'Malware Hunter',
        desc: 'Mengidentifikasi perilaku malware dengan tepat pada simulasi Malware Lab.',
        ap: 100,
        bonusCredits: 250,
        check: (st) => st.labStats.malwareSolved >= 2
      },
      {
        id: 'ach_soc_defender',
        title: 'SOC Defender',
        desc: 'Menyelesaikan minimal 12 misi dan mencapai Level 4.',
        ap: 150,
        bonusCredits: 350,
        check: (st) => st.completedMissions.length >= 12 && st.player.level >= 4
      },
      {
        id: 'ach_sec_engineer',
        title: 'Security Engineer',
        desc: 'Mengamankan topologi jaringan di Network Defense atau memiliki minimal 3 item.',
        ap: 180,
        bonusCredits: 400,
        check: (st) => st.labStats.networkHardened >= 1 || st.inventory.length >= 3
      },
      {
        id: 'ach_sec_architect',
        title: 'Security Architect',
        desc: 'Mencapai Level 8 atau mengalokasikan minimal 5 Skill Points.',
        ap: 250,
        bonusCredits: 600,
        check: (st) => {
          const totalSkills = Object.values(st.skills).reduce((acc, v) => acc + v, 0);
          return st.player.level >= 8 || totalSkills >= 5;
        }
      },
      {
        id: 'ach_sec_legend',
        title: 'Security Legend',
        desc: 'Menyelesaikan minimal 25 misi dan menjawab benar minimal 15 soal kuis.',
        ap: 350,
        bonusCredits: 900,
        check: (st) => st.completedMissions.length >= 25 && st.quizStats.correctAnswers >= 15
      },
      {
        id: 'ach_cyber_guardian',
        title: 'Cyber Guardian',
        desc: 'Mencapai Level 12 dan mengoleksi minimal 5 perangkat di Armory.',
        ap: 500,
        bonusCredits: 1200,
        check: (st) => st.player.level >= 12 && st.inventory.length >= 5
      }
    ];
  }

  evaluateAll() {
    const unlockedSet = new Set(this.game.state.unlockedAchievements);
    let newlyUnlocked = false;

    for (const ach of this.achievements) {
      if (unlockedSet.has(ach.id)) continue;
      const predicate = typeof ach.check === 'function'
        ? ach.check
        : this.buildCheckFromRule(ach.ruleType, ach.ruleValue);

      if (predicate && predicate(this.game.state)) {
        unlockedSet.add(ach.id);
        this.game.state.unlockedAchievements.push(ach.id);
        this.game.state.player.achievementPoints += ach.ap || 50;
        this.game.state.player.credits += ach.bonusCredits || 100;
        newlyUnlocked = true;
        this.game.sound.success();
        this.game.ui.toast(`🏆 Achievement Terbuka: ${ach.title} (+${ach.ap} AP)!`, 'success');
      }
    }

    return newlyUnlocked;
  }

  buildCheckFromRule(ruleType, ruleValue) {
    switch (ruleType) {
      case 'initialized':
        return (st) => Boolean(st.initialized);
      case 'missionsCount':
        return (st) => st.completedMissions.length >= (ruleValue || 1);
      case 'malwareSolved':
        return (st) => st.labStats.malwareSolved >= (ruleValue || 1);
      case 'networkHardened':
        return (st) => st.labStats.networkHardened >= (ruleValue || 1);
      case 'inventoryCount':
        return (st) => st.inventory.length >= (ruleValue || 1);
      case 'levelReached':
        return (st) => st.player.level >= (ruleValue || 1);
      case 'quizCorrect':
        return (st) => st.quizStats.correctAnswers >= (ruleValue || 1);
      default:
        return () => false;
    }
  }

  render() {
    const grid = document.getElementById('achievements-grid');
    if (!grid) return;

    const unlockedSet = new Set(this.game.state.unlockedAchievements);
    grid.innerHTML = this.achievements.map(ach => {
      const unlocked = unlockedSet.has(ach.id);
      return `
        <div class="card glowing-card mission-card ${unlocked ? 'completed' : ''}">
          <div>
            <div class="card-title-row">
              <span class="badge-neon">${unlocked ? '🏆 UNLOCKED' : '🔒 LOCKED'}</span>
              <span class="mono-text neon-amber">+${ach.ap} AP</span>
            </div>
            <h4>${ach.title}</h4>
            <p class="briefing-box">${ach.desc}</p>
          </div>
          <div class="reward-strip">
            <span class="neon-green">+₵ ${ach.bonusCredits}</span>
            <span>${unlocked ? 'Terverifikasi' : 'Belum Tercapai'}</span>
          </div>
        </div>
      `;
    }).join('');
  }
}
