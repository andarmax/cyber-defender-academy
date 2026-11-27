/**
 * InventoryManager - Security Armory & Equipment System
 */
export class InventoryManager {
  constructor(game, itemsData = []) {
    this.game = game;
    this.items = Array.isArray(itemsData) && itemsData.length > 0
      ? itemsData
      : this.getFallbackItems();
  }

  getFallbackItems() {
    return [
      { id: 'fw_basic', name: 'Perimeter Firewall v1', category: 'Firewall Upgrade', cost: 500, desc: 'Menyaring trafik dasar dan meningkatkan Security Posture.' },
      { id: 'tk_logparser', name: 'Forensic Log Analyzer Kit', category: 'Security Toolkit', cost: 800, desc: 'Membantu inspeksi jejak log defensif lebih rapi.' },
      { id: 'sc_netmap', name: 'Internal Asset Scanner', category: 'Threat Scanner', cost: 1100, desc: 'Inventarisasi aset internal untuk pemetaan risiko.' },
      { id: 'siem_core', name: 'SOC SIEM Correlation Engine', category: 'SIEM Upgrade', cost: 1600, desc: 'Meningkatkan visibilitas alert dan posture keamanan.' },
      { id: 'bdg_blue', name: 'Blue Team Responder Badge', category: 'Security Badge', cost: 1200, desc: 'Lencana kehormatan tim pertahanan siber.' },
      { id: 'spc_ciso_key', name: 'CISO Governance Charter', category: 'Special Item', cost: 2500, desc: 'Dokumen kebijakan strategis tata kelola keamanan perusahaan.' }
    ];
  }

  render() {
    const grid = document.getElementById('inventory-grid');
    const credDisp = document.getElementById('shop-credits-display');
    if (!grid) return;

    const credits = this.game.state.player.credits;
    if (credDisp) credDisp.textContent = `₵ ${credits.toLocaleString()}`;

    grid.innerHTML = this.items.map(item => {
      const owned = this.game.state.inventory.includes(item.id);
      const canAfford = credits >= item.cost;
      return `
        <div class="card glowing-card mission-card">
          <div>
            <div class="card-title-row">
              <span class="badge-neon">${item.category}</span>
              <span class="mono-text neon-green">₵ ${item.cost.toLocaleString()}</span>
            </div>
            <h4>${item.name}</h4>
            <p class="briefing-box">${item.desc}</p>
          </div>
          <button class="btn ${owned ? 'btn-outline' : 'btn-primary'} btn-block btn-buy-item"
            data-id="${item.id}" ${owned || !canAfford ? 'disabled' : ''}>
            ${owned ? '✅ Dimiliki (Owned)' : canAfford ? 'Beli Perangkat' : 'Credits Tidak Cukup'}
          </button>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.btn-buy-item').forEach(btn => {
      btn.addEventListener('click', () => this.buyItem(btn.dataset.id));
    });
  }

  buyItem(itemId) {
    const item = this.items.find(i => i.id === itemId);
    if (!item || this.game.state.inventory.includes(itemId)) return;
    if (this.game.state.player.credits < item.cost) return;

    this.game.state.player.credits -= item.cost;
    this.game.state.inventory.push(itemId);
    this.game.sound.success();
    this.game.achievements.evaluateAll();
    this.game.autoSave(false);
    this.game.refreshAllViews();
    this.game.ui.toast(`${item.name} berhasil ditambahkan ke Inventory!`, 'success');
  }
}
