/**
 * LeaderboardManager - LocalStorage Operative Ranking & Save Metadata
 */
const LB_STORAGE_KEY = 'cda_local_leaderboard_v1';

export class LeaderboardManager {
  constructor(game) {
    this.game = game;
  }

  getDefaultRivals() {
    return [
      { username: 'Nadia_SOC', title: 'SOC Analyst', level: 8, xp: 4200, achievements: 5, isPlayer: false },
      { username: 'Raka_Blue', title: 'Security Analyst', level: 5, xp: 2150, achievements: 4, isPlayer: false },
      { username: 'Sinta_DFIR', title: 'Junior Analyst', level: 3, xp: 1120, achievements: 2, isPlayer: false },
      { username: 'Bima_Net', title: 'Intern', level: 2, xp: 640, achievements: 1, isPlayer: false }
    ];
  }

  getPlayerEntry() {
    const p = this.game.state.player;
    const rank = this.game.player.getCurrentRank();
    const totalXP = ((p.level - 1) * 500) + p.xp;
    return {
      username: p.username,
      title: rank.title,
      level: p.level,
      xp: totalXP,
      achievements: this.game.state.unlockedAchievements.length,
      isPlayer: true
    };
  }

  getEntries() {
    let rivals = this.getDefaultRivals();
    try {
      const saved = localStorage.getItem(LB_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          rivals = parsed.filter(e => !e.isPlayer);
        }
      }
    } catch {
      // Fallback ke default rivals
    }

    const combined = [...rivals, this.getPlayerEntry()].sort((a, b) => b.xp - a.xp);
    try {
      localStorage.setItem(LB_STORAGE_KEY, JSON.stringify(combined));
    } catch {
      // Abaikan jika quota penuh
    }
    return combined;
  }

  render() {
    const tbody = document.getElementById('leaderboard-tbody');
    const metaBox = document.getElementById('save-metadata-box');

    if (tbody) {
      const entries = this.getEntries();
      tbody.innerHTML = entries.map((e, idx) => `
        <tr style="${e.isPlayer ? 'background: rgba(0, 240, 255, 0.12); font-weight: 700;' : ''}">
          <td>#${idx + 1}</td>
          <td>${e.username} ${e.isPlayer ? '<span class="badge-neon">YOU</span>' : ''}</td>
          <td>${e.title}</td>
          <td>LVL ${e.level}</td>
          <td class="neon-blue">${e.xp.toLocaleString()} XP</td>
          <td class="neon-amber">${e.achievements}</td>
        </tr>
      `).join('');
    }

    if (metaBox) {
      const st = this.game.state;
      metaBox.innerHTML = `
        <div><strong>Schema Version:</strong> ${st.version}</div>
        <div><strong>Last Auto-Save:</strong> ${new Date(st.lastSaved).toLocaleString('id-ID')}</div>
        <div><strong>Completed Missions:</strong> ${st.completedMissions.length}</div>
        <div><strong>Unlocked Achievements:</strong> ${st.unlockedAchievements.length}</div>
      `;
    }
  }
}
