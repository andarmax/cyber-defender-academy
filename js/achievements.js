/**
 * AchievementManager - Core & Expanded Achievements (CTI, SIEM, Frameworks, Certifications)
 */
import { escapeHTML } from './missions.js';

const BUILTIN_ACHIEVEMENTS = [
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
    desc: 'Menyelesaikan minimal 5 misi pertahanan siber.',
    ap: 100,
    bonusCredits: 250,
    check: (st) => st.completedMissions.length >= 5
  },
  {
    id: 'ach_malware_hunter',
    title: 'Malware Hunter',
    desc: 'Mengidentifikasi minimal 2 skenario perilaku malware di Cyber Labs.',
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
    desc: 'Mengamankan topologi jaringan di Network Defense atau memiliki 3 item Armory.',
    ap: 180,
    bonusCredits: 400,
    check: (st) => st.labStats.networkHardened >= 1 || st.inventory.length >= 3
  },
  {
    id: 'ach_sec_architect',
    title: 'Security Architect',
    desc: 'Mencapai Level 8 atau mengalokasikan minimal 6 Skill Points.',
    ap: 250,
    bonusCredits: 600,
    check: (st) => {
      const totalSkills = Object.values(st.skills).reduce((acc, v) => acc + v, 0);
      return st.player.level >= 8 || totalSkills >= 6;
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
  },
  // --- EXPANDED ACHIEVEMENTS ---
  {
    id: 'ach_cti_analyst',
    title: 'CTI Analyst',
    desc: 'Menganalisis minimal 3 indikator IOC di Threat Intelligence Center.',
    ap: 140,
    bonusCredits: 300,
    check: (st) => (st.threatIntelStats?.iocsAnalyzed || 0) >= 3
  },
  {
    id: 'ach_campaign_tracker',
    title: 'Campaign Tracker',
    desc: 'Memverifikasi seluruh Threat Reports & Malware Campaign Briefs.',
    ap: 220,
    bonusCredits: 500,
    check: (st) => (st.threatIntelStats?.briefsReviewed?.length || 0) >= 3
  },
  {
    id: 'ach_siem_triage',
    title: 'SIEM Triage Specialist',
    desc: 'Mengklasifikasikan minimal 10 event log di Mini SIEM Console.',
    ap: 160,
    bonusCredits: 350,
    check: (st) => (st.siemStats?.totalTriaged || 0) >= 10
  },
  {
    id: 'ach_precision_soc',
    title: 'Precision SOC Analyst',
    desc: 'Menangani 20+ event SIEM dengan False Positive Rate ≤ 10%.',
    ap: 300,
    bonusCredits: 700,
    check: (st) => {
      const s = st.siemStats || {};
      const benign = (s.trueNegatives || 0) + (s.falsePositives || 0);
      const fpRate = benign > 0 ? ((s.falsePositives || 0) / benign) * 100 : 0;
      return (s.totalTriaged || 0) >= 20 && fpRate <= 10;
    }
  },
  {
    id: 'ach_framework_scholar',
    title: 'Framework Scholar',
    desc: 'Menerapkan pemetaan NIST CSF, NIST 800-61, CIS, CVSS, CWE, dan MITRE pada 10+ misi.',
    ap: 200,
    bonusCredits: 450,
    check: (st) => (st.frameworkProgress?.nistCsf || 0) >= 10
  },
  {
    id: 'ach_nist_mitre_pro',
    title: 'NIST & MITRE Practitioner',
    desc: 'Menguasai pemetaan kontrol defensif pada 30+ operasi keamanan.',
    ap: 350,
    bonusCredits: 800,
    check: (st) => (st.frameworkProgress?.mitreAttack || 0) >= 30
  },
  {
    id: 'ach_cert_starter',
    title: 'Certified Defender',
    desc: 'Meraih sertifikasi simulatif pertama pada Certification Career Roadmap.',
    ap: 180,
    bonusCredits: 400,
    check: (st) => (st.certifications?.length || 0) >= 1
  },
  {
    id: 'ach_cert_cissp_sim',
    title: 'Executive Security Leader',
    desc: 'Meraih sertifikasi puncak CISSP (Simulatif).',
    ap: 600,
    bonusCredits: 1500,
    check: (st) => Array.isArray(st.certifications) && st.certifications.includes('cert_cissp_sim')
  }
];

export class AchievementManager {
  constructor(game, achievementsData = []) {
    this.game = game;
    const map = new Map();
    if (Array.isArray(achievementsData)) {
      for (const item of achievementsData) {
        if (item && item.id) map.set(item.id, item);
      }
    }
    for (const builtin of BUILTIN_ACHIEVEMENTS) {
      map.set(builtin.id, { ...(map.get(builtin.id) || {}), ...builtin });
    }
    this.achievements = Array.from(map.values());
  }

  evaluateAll() {
    const unlockedSet = new Set(this.game.state.unlockedAchievements);
    let newlyUnlocked = false;

    for (const ach of this.achievements) {
      if (unlockedSet.has(ach.id)) continue;
      const predicate = typeof ach.check === 'function' ? ach.check : () => false;
      if (predicate(this.game.state)) {
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
            <h4>${escapeHTML(ach.title)}</h4>
            <p class="briefing-box">${escapeHTML(ach.desc)}</p>
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