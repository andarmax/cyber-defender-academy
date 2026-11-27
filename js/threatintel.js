/**
 * ThreatIntelManager - IOC Triage Simulator, Threat Reports & Malware Campaign Briefs
 */
import { escapeHTML } from './missions.js';

const SIMULATED_IOCS = [
  {
    id: 'IOC-01',
    indicator: '198.51.100.77',
    type: 'IPv4 Address (RFC 5737 Sim)',
    telemetry: 'Terdeteksi melakukan 140 koneksi keluar berpola beacon setiap 60 detik ke port 8443 dari host finance-ws04.',
    mitre: 'T1071.001 — Web Protocols (C2 Beaconing)',
    severity: 'Critical',
    action: 'Isolasi host finance-ws04, blokir egress IP di Perimeter Firewall, dan akuisisi memori.',
    explanation: 'Beaconing periodik keluar dari workstation keuangan menuju IP eksternal tak dikenal menandakan komunikasi Command & Control aktif.'
  },
  {
    id: 'IOC-02',
    indicator: 'login-nusantara-shield.example',
    type: 'Domain Name',
    telemetry: 'Domain baru didaftarkan 4 jam lalu dengan sertifikat TLS gratis dan halaman tiruan portal SSO internal.',
    mitre: 'T1583.001 — Acquire Infrastructure: Domains',
    severity: 'High',
    action: 'Tambahkan ke DNS Sinkhole / Web Proxy Blocklist dan audit log klik email.',
    explanation: 'Domain lookalike yang baru dibuat untuk meniru portal SSO merupakan infrastruktur kampanye credential harvesting.'
  },
  {
    id: 'IOC-03',
    indicator: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    type: 'SHA-256 Hash (Empty File Baseline)',
    telemetry: 'Hash standar berkas kosong (0-byte file) muncul saat skrip pembersih direktori temp berjalan.',
    mitre: 'Benign / Administrative Baseline',
    severity: 'Low',
    action: 'Whitelist sebagai hash berkas 0-byte standar agar tidak memicu False Positive di SIEM.',
    explanation: 'Nilai SHA-256 e3b0c442... adalah hash kriptografis baku untuk file kosong (0 byte), bukan malware.'
  },
  {
    id: 'IOC-04',
    indicator: 'update-cdn-assets.internal.co.id',
    type: 'Internal Subdomain',
    telemetry: 'Server repositori paket internal mendistribusikan pembaruan rutin sesuai jadwal maintenance window resmi.',
    mitre: 'Authorized Internal Infrastructure',
    severity: 'Low',
    action: 'Verifikasi hash rilis paket dengan tim DevOps dan tandai sebagai trafik terotorisasi.',
    explanation: 'Aktivitas sesuai jadwal perubahan (Change Management) dan berasal dari server repositori internal resmi.'
  },
  {
    id: 'IOC-05',
    indicator: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    type: 'SHA-256 Payload Hash (Sim)',
    telemetry: 'Binary tak bertanda tangan di folder Downloads mencoba menonaktifkan layanan Volume Shadow Copy.',
    mitre: 'T1490 — Inhibit System Recovery',
    severity: 'Critical',
    action: 'Karantina binary via EDR, isolasi endpoint segera, dan verifikasi integritas backup offline.',
    explanation: 'Upaya menonaktifkan Volume Shadow Copy adalah indikator pra-enkripsi Ransomware dengan tingkat keparahan Critical.'
  },
  {
    id: 'IOC-06',
    indicator: '203.0.113.19',
    type: 'IPv4 Address (RFC 5737 Sim)',
    telemetry: 'Melakukan pemindaian port TCP terbatas pada interface publik DMZ yang sudah diblokir firewall.',
    mitre: 'T1046 — Network Service Discovery',
    severity: 'Medium',
    action: 'Pertahankan aturan drop pada DMZ firewall dan pantau apakah ada eskalasi ke lapisan aplikasi.',
    explanation: 'Pemindaian eksternal yang sudah tertahan di perimeter DMZ memiliki risiko Medium dan perlu pemantauan berkelanjutan.'
  }
];

const CAMPAIGN_BRIEFS = [
  {
    id: 'CMP-01',
    title: 'Campaign Brief: Operation GlassLedger (BEC & OAuth Consent)',
    severity: 'High',
    targetSector: 'Corporate Finance & Executive Leadership',
    summary: 'Kampanye rekayasa sosial terarah yang memanfaatkan email invoice tiruan dan permintaan izin aplikasi OAuth pihak ketiga untuk membaca kotak masuk tanpa mencuri password secara langsung.',
    mitreTechniques: [
      'T1566.002 — Spearphishing Link',
      'T1528 — Steal Application Access Token (OAuth Consent)',
      'T1114.003 — Email Forwarding Rule'
    ],
    defensiveControls: [
      'NIST CSF PR.AC-4: Batasi persetujuan aplikasi OAuth hanya oleh Administrator.',
      'CIS Control 9.5: Terapkan kebijakan DMARC p=reject dan peringatan email eksternal.',
      'Audit aturan inbox forwarding secara otomatis melalui SIEM.'
    ]
  },
  {
    id: 'CMP-02',
    title: 'Campaign Brief: ShadowBeacon DNS Tunneling',
    severity: 'Critical',
    targetSector: 'Enterprise Server & Hybrid Cloud Infrastructure',
    summary: 'Aktivitas komunikasi tersembunyi yang menyandikan telemetri ke dalam subdomain TXT/A ber-entropi tinggi menuju resolver eksternal tidak terotorisasi.',
    mitreTechniques: [
      'T1071.004 — Application Layer Protocol: DNS',
      'T1048.003 — Exfiltration Over Unencrypted Non-C2 Protocol',
      'T1573 — Encrypted Channel'
    ],
    defensiveControls: [
      'CIS Control 8.5: Aktifkan pencatatan query DNS lengkap pada resolver internal.',
      'NIST CSF DE.CM-1: Terapkan deteksi anomali panjang subdomain & frekuensi query DNS.',
      'Paksa seluruh resolusi DNS keluar melewati Protective DNS internal.'
    ]
  },
  {
    id: 'CMP-03',
    title: 'Campaign Brief: VaultLock Pre-Ransomware Staging',
    severity: 'Critical',
    targetSector: 'Shared Storage & Virtualization Hosts',
    summary: 'Pola insiden bertahap yang dimulai dari kompromi akun VPN tanpa MFA, diikuti enumerasi direktori jaringan internal, penonaktifan cadangan lokal, dan enkripsi massal.',
    mitreTechniques: [
      'T1078 — Valid Accounts (VPN Access)',
      'T1083 — File and Directory Discovery',
      'T1490 — Inhibit System Recovery',
      'T1486 — Data Encrypted for Impact'
    ],
    defensiveControls: [
      'CIS Control 6.5: Wajibkan MFA tahan phishing pada seluruh akses VPN & akun istimewa.',
      'CIS Control 11.4: Terapkan arsitektur backup 3-2-1 dengan penyimpanan immutable/offline.',
      'NIST SP 800-61: Siapkan playbook isolasi subnet otomatis saat terdeteksi modifikasi file massal.'
    ]
  }
];

export class ThreatIntelManager {
  constructor(game) {
    this.game = game;
    this.activeSubTab = 'ioc';
  }

  render() {
    const wrap = document.getElementById('ti-workspace');
    if (!wrap) return;

    const stats = this.game.state.threatIntelStats;
    const accuracy = stats.iocsAnalyzed > 0
      ? Math.round((stats.iocsCorrect / stats.iocsAnalyzed) * 100)
      : 100;

    wrap.innerHTML = `
      <div class="card-title-row" style="margin-bottom:1rem;">
        <div class="lab-tabs" style="margin-bottom:0;">
          <button class="lab-tab ti-tab ${this.activeSubTab === 'ioc' ? 'active' : ''}" data-sub="ioc">🎯 IOC Triage Simulator</button>
          <button class="lab-tab ti-tab ${this.activeSubTab === 'campaigns' ? 'active' : ''}" data-sub="campaigns">📑 Threat Reports & Campaigns</button>
        </div>
        <div class="mono-text">
          IOCs Analyzed: <strong class="neon-blue">${stats.iocsAnalyzed}</strong> |
          Accuracy: <strong class="neon-green">${accuracy}%</strong> |
          Briefs Reviewed: <strong class="neon-amber">${stats.briefsReviewed.length}/${CAMPAIGN_BRIEFS.length}</strong>
        </div>
      </div>
      <div id="ti-sub-content"></div>
    `;

    wrap.querySelectorAll('.ti-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        this.game.sound.click();
        this.activeSubTab = btn.dataset.sub;
        this.render();
      });
    });

    const sub = document.getElementById('ti-sub-content');
    if (this.activeSubTab === 'ioc') this.renderIOCSimulator(sub);
    else this.renderCampaignBriefs(sub);
  }

  renderIOCSimulator(container) {
    const idx = this.game.state.threatIntelStats.iocsAnalyzed % SIMULATED_IOCS.length;
    const ioc = SIMULATED_IOCS[idx];

    container.innerHTML = `
      <div class="card glowing-card">
        <div class="card-title-row">
          <span class="badge-neon">${escapeHTML(ioc.id)} • ${escapeHTML(ioc.type)}</span>
          <span class="mono-text">MITRE Mapping: ${escapeHTML(ioc.mitre)}</span>
        </div>
        <div class="artifact-box" style="margin-top:0.75rem;">
          <strong>INDICATOR:</strong> ${escapeHTML(ioc.indicator)}\n<strong>CONTEXT TELEMETRY:</strong> ${escapeHTML(ioc.telemetry)}
        </div>
        <p style="margin-bottom:0.65rem;"><strong>Tentukan Klasifikasi Threat Severity:</strong></p>
        <div style="display:flex; gap:0.6rem; flex-wrap:wrap;">
          ${['Low', 'Medium', 'High', 'Critical'].map(sev => `
            <button class="btn btn-outline btn-ioc-sev" data-sev="${sev}">${sev}</button>
          `).join('')}
        </div>
        <div id="ioc-feedback" class="feedback-box hidden"></div>
      </div>
    `;

    container.querySelectorAll('.btn-ioc-sev').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.btn-ioc-sev').forEach(b => (b.disabled = true));
        const chosen = btn.dataset.sev;
        const isCorrect = chosen === ioc.severity;
        const stats = this.game.state.threatIntelStats;
        stats.iocsAnalyzed += 1;

        const fb = document.getElementById('ioc-feedback');
        fb.classList.remove('hidden');

        if (isCorrect) {
          stats.iocsCorrect += 1;
          btn.classList.add('correct');
          this.game.sound.success();
          const rew = this.game.player.grantRewards({ xp: 95, credits: 115, reputation: 1 });
          this.game.advanceDailyProgress('THREAT_INTEL', 1);
          fb.innerHTML = `
            <strong class="neon-green">✅ Triage IOC Tepat (${ioc.severity})! (+${rew.finalXP} XP, +₵ ${rew.finalCredits})</strong>
            <p style="margin:0.4rem 0;">${escapeHTML(ioc.explanation)}</p>
            <p class="mono-text neon-blue">Mitigasi Direkomendasikan: ${escapeHTML(ioc.action)}</p>
            <button id="btn-next-ioc" class="btn btn-sm btn-primary" style="margin-top:0.75rem;">Analisis IOC Berikutnya →</button>
          `;
        } else {
          btn.classList.add('wrong');
          this.game.sound.warning();
          this.game.player.grantRewards({ xp: 15, credits: 0, reputation: -1 });
          fb.innerHTML = `
            <strong class="neon-red">⚠️ Severity Kurang Tepat (Seharusnya: ${ioc.severity})</strong>
            <p style="margin:0.4rem 0;">${escapeHTML(ioc.explanation)}</p>
            <p class="mono-text neon-blue">Mitigasi Direkomendasikan: ${escapeHTML(ioc.action)}</p>
            <button id="btn-next-ioc" class="btn btn-sm btn-outline" style="margin-top:0.75rem;">Analisis IOC Berikutnya →</button>
          `;
        }

        this.game.achievements.evaluateAll();
        this.game.autoSave(false);
        this.game.ui.renderHUD();
        this.game.ui.renderDashboard();

        document.getElementById('btn-next-ioc')?.addEventListener('click', () => {
          this.render();
        });
      });
    });
  }

  renderCampaignBriefs(container) {
    const reviewedSet = new Set(this.game.state.threatIntelStats.briefsReviewed);

    container.innerHTML = `
      <div class="missions-grid">
        ${CAMPAIGN_BRIEFS.map(b => {
          const done = reviewedSet.has(b.id);
          const sevClass = b.severity === 'Critical' ? 'high' : 'medium';
          return `
            <div class="card glowing-card mission-card ${done ? 'completed' : ''}">
              <div>
                <div class="card-title-row">
                  <span class="badge-neon">${escapeHTML(b.id)}</span>
                  <span class="threat-badge ${sevClass}">SEVERITY: ${escapeHTML(b.severity.toUpperCase())}</span>
                </div>
                <h4>${escapeHTML(b.title)}</h4>
                <p class="subtitle" style="margin-bottom:0.5rem;">Target Sector: ${escapeHTML(b.targetSector)}</p>
                <p class="briefing-box">${escapeHTML(b.summary)}</p>
                <div class="artifact-box" style="font-size:0.78rem;">
                  <strong>MITRE ATT&CK MAPPING:</strong>\n• ${b.mitreTechniques.map(escapeHTML).join('\n• ')}\n\n<strong>DEFENSIVE COUNTERMEASURES:</strong>\n• ${b.defensiveControls.map(escapeHTML).join('\n• ')}
                </div>
              </div>
              <button class="btn ${done ? 'btn-outline' : 'btn-primary'} btn-block btn-ack-brief" data-id="${escapeHTML(b.id)}" ${done ? 'disabled' : ''}>
                ${done ? '✅ Intelligence Brief Terverifikasi' : 'Konfirmasi & Terapkan Deteksi (+120 XP)'}
              </button>
            </div>
          `;
        }).join('')}
      </div>
    `;

    container.querySelectorAll('.btn-ack-brief').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        if (reviewedSet.has(id)) return;
        this.game.state.threatIntelStats.briefsReviewed.push(id);
        this.game.sound.success();
        const rew = this.game.player.grantRewards({ xp: 120, credits: 140, reputation: 2 });
        this.game.advanceDailyProgress('THREAT_INTEL', 1);
        this.game.achievements.evaluateAll();
        this.game.autoSave(false);
        this.game.refreshAllViews();
        this.game.ui.toast(`Intelligence Brief ${id} diterapkan (+${rew.finalXP} XP)!`, 'success');
      });
    });
  }
}
