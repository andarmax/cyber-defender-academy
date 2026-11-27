/**
 * SkillTreeManager - 8 Specialized Cybersecurity Skill Branches
 */
export const SKILL_DEFINITIONS = [
  { key: 'networkSecurity', name: 'Network Security', maxLevel: 5, effect: '+3% Posture & segmentasi per level' },
  { key: 'cloudSecurity', name: 'Cloud Security', maxLevel: 5, effect: '+3% Credits & pengamanan cloud per level' },
  { key: 'securityOperations', name: 'Security Operations', maxLevel: 5, effect: '+3% Posture & deteksi alert SOC per level' },
  { key: 'digitalForensics', name: 'Digital Forensics', maxLevel: 5, effect: 'Akurasi analisis artefak & timeline per level' },
  { key: 'incidentResponse', name: 'Incident Response', maxLevel: 5, effect: '+2% Posture & kecepatan eskalasi per level' },
  { key: 'securityAwareness', name: 'Security Awareness', maxLevel: 5, effect: '+4% XP bonus per level' },
  { key: 'threatIntelligence', name: 'Threat Intelligence', maxLevel: 5, effect: 'Korelasi indikator ancaman defensif per level' },
  { key: 'grc', name: 'Governance Risk & Compliance', maxLevel: 5, effect: '+5% Credits & +3% XP bonus per level' }
];

export class SkillTreeManager {
  constructor(game) {
    this.game = game;
  }

  render() {
    const grid = document.getElementById('skilltree-grid');
    const spDisp = document.getElementById('skill-sp-display');
    if (!grid) return;

    const sp = this.game.state.player.skillPoints;
    if (spDisp) spDisp.textContent = sp;

    grid.innerHTML = SKILL_DEFINITIONS.map(sk => {
      const lvl = this.game.state.skills[sk.key] || 0;
      const maxed = lvl >= sk.maxLevel;
      const pips = Array.from({ length: sk.maxLevel }, (_, i) =>
        `<span class="pip ${i < lvl ? 'filled' : ''}"></span>`
      ).join('');

      return `
        <div class="card glowing-card skill-card">
          <div>
            <div class="card-title-row">
              <h4>${sk.name}</h4>
              <span class="mono-text neon-blue">LVL ${lvl}/${sk.maxLevel}</span>
            </div>
            <div class="skill-pips" style="margin-bottom:0.65rem;">${pips}</div>
            <p class="subtitle">${sk.effect}</p>
          </div>
          <button class="btn ${maxed ? 'btn-outline' : 'btn-primary'} btn-sm btn-upgrade-skill"
            data-key="${sk.key}" ${maxed || sp <= 0 ? 'disabled' : ''}>
            ${maxed ? 'MAXED' : 'Upgrade (+1 SP)'}
          </button>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.btn-upgrade-skill').forEach(btn => {
      btn.addEventListener('click', () => this.upgradeSkill(btn.dataset.key));
    });
  }

  upgradeSkill(key) {
    const def = SKILL_DEFINITIONS.find(s => s.key === key);
    if (!def) return;
    const curr = this.game.state.skills[key] || 0;
    if (this.game.state.player.skillPoints <= 0 || curr >= def.maxLevel) return;

    this.game.state.player.skillPoints -= 1;
    this.game.state.skills[key] = curr + 1;
    this.game.sound.success();
    this.game.achievements.evaluateAll();
    this.game.autoSave(false);
    this.game.refreshAllViews();
    this.game.ui.toast(`${def.name} meningkat ke Level ${curr + 1}!`, 'success');
  }
}
