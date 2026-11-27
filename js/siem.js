/**
 * SIEMConsoleManager - Defensive Log Triage & Classification Console
 */
import { escapeHTML } from './missions.js';

const SIEM_LOG_EVENTS = [
  {
    id: 'EVT-101',
    source: 'Authentication Logs',
    timestamp: '2026-11-28T01:14:22Z',
    host: 'dc-core-01.internal',
    raw: 'EventID=4625 SubStatus=0xC000006A User=admin_finance SrcIP=198.51.100.88 Attempts=68 Window=90s',
    classification: 'malicious',
    rule: 'SOC-AUTH-004: High-Velocity Credential Guessing on Privileged Account',
    explanation: '68 kegagalan autentikasi dalam 90 detik dari IP eksternal terhadap akun istimewa adalah serangan brute-force aktif (Malicious).'
  },
  {
    id: 'EVT-102',
    source: 'Authentication Logs',
    timestamp: '2026-11-28T08:30:05Z',
    host: 'sso-idp-01.internal',
    raw: 'EventID=4624 User=nadia.putri SrcIP=10.20.4.15 MFA=FIDO2_Verified Device=Managed-Laptop-09',
    classification: 'benign',
    rule: 'SOC-AUTH-001: Standard Corporate SSO Login',
    explanation: 'Login jam kerja dari subnet internal terkelola dengan verifikasi MFA FIDO2 adalah aktivitas normal (Benign).'
  },
  {
    id: 'EVT-103',
    source: 'Authentication Logs',
    timestamp: '2026-11-28T02:41:10Z',
    host: 'sso-idp-01.internal',
    raw: 'EventID=4624 User=raka.pratama SrcIP=203.0.113.55 Note="Login 12m after Jakarta office badge swipe"',
    classification: 'suspicious',
    rule: 'SOC-AUTH-009: Impossible Travel / Geolocation Anomaly',
    explanation: 'Perbedaan lokasi login dalam selang waktu singkat memerlukan verifikasi langsung dengan pengguna dan audit sesi (Suspicious).'
  },
  {
    id: 'EVT-104',
    source: 'Firewall Logs',
    timestamp: '2026-11-28T03:05:44Z',
    host: 'fw-perimeter-01',
    raw: 'ACTION=ALLOW DIR=OUTBOUND SrcIP=10.30.12.40 DstIP=198.51.100.199 DstPort=4444 Proto=TCP BytesOut=48MB',
    classification: 'malicious',
    rule: 'SOC-FW-012: Unauthorized Outbound Traffic on Non-Standard Port 4444',
    explanation: 'Transfer data keluar 48MB ke IP eksternal melalui port non-standar 4444 mengindikasikan eksfiltrasi/C2 (Malicious).'
  },
  {
    id: 'EVT-105',
    source: 'Firewall Logs',
    timestamp: '2026-11-28T09:12:00Z',
    host: 'fw-perimeter-01',
    raw: 'ACTION=ALLOW DIR=OUTBOUND SrcIP=10.10.5.22 DstIP=192.0.2.10 DstPort=443 App=WindowsUpdate_CDN',
    classification: 'benign',
    rule: 'SOC-FW-002: Approved OS Patch Repository Traffic',
    explanation: 'Trafik HTTPS terotorisasi menuju layanan pembaruan sistem resmi adalah operasi normal (Benign).'
  },
  {
    id: 'EVT-106',
    source: 'Firewall Logs',
    timestamp: '2026-11-28T11:48:19Z',
    host: 'fw-internal-vlan',
    raw: 'ACTION=DROP DIR=EAST-WEST SrcIP=10.20.8.14 DstSubnet=10.99.0.0/24 DstPort=22,3389 Count=14',
    classification: 'suspicious',
    rule: 'SOC-FW-019: Cross-VLAN Administrative Port Probing',
    explanation: 'Workstation staf mencoba menjangkau port SSH/RDP pada VLAN server produksi; perlu investigasi host sumber (Suspicious).'
  },
  {
    id: 'EVT-107',
    source: 'DNS Logs',
    timestamp: '2026-11-28T04:19:33Z',
    host: 'dns-resolver-02.internal',
    raw: 'Query=a9f82c71e4b09912d3f4a1b2c3.exfil-sim.example Type=TXT ClientIP=10.30.14.9 Freq=12/min',
    classification: 'malicious',
    rule: 'SOC-DNS-007: High-Entropy Subdomain TXT Tunneling Pattern',
    explanation: 'Query berfrekuensi tinggi dengan subdomain heksadesimal panjang pada record TXT adalah pola DNS tunneling (Malicious).'
  },
  {
    id: 'EVT-108',
    source: 'DNS Logs',
    timestamp: '2026-11-28T10:02:11Z',
    host: 'dns-resolver-01.internal',
    raw: 'Query=intranet.perusahaan.co.id Type=A ClientIP=10.20.3.41 Response=NOERROR',
    classification: 'benign',
    rule: 'SOC-DNS-001: Internal Portal Resolution',
    explanation: 'Resolusi DNS standar ke domain intranet internal perusahaan adalah trafik normal (Benign).'
  },
  {
    id: 'EVT-109',
    source: 'DNS Logs',
    timestamp: '2026-11-28T13:27:50Z',
    host: 'dns-resolver-01.internal',
    raw: 'Query=bulk-free-vpn-proxy.example Type=A ClientIP=10.20.6.77 Response=NXDOMAIN',
    classification: 'suspicious',
    rule: 'SOC-DNS-014: Shadow IT / Unapproved Proxy Domain Lookup',
    explanation: 'Upaya mengakses layanan proxy eksternal tidak terotorisasi melanggar kebijakan penggunaan jaringan dan perlu ditinjau (Suspicious).'
  },
  {
    id: 'EVT-110',
    source: 'VPN Logs',
    timestamp: '2026-11-28T01:55:09Z',
    host: 'vpn-gw-01.perimeter',
    raw: 'User=svc_vendor_old Tunnel=UP SrcIP=203.0.113.99 Note="Account scheduled for decommission 30 days ago"',
    classification: 'malicious',
    rule: 'SOC-VPN-008: Dormant / Decommissioned Vendor Account Access',
    explanation: 'Koneksi VPN aktif menggunakan akun vendor lama yang seharusnya sudah dinonaktifkan adalah akses tidak sah berisiko tinggi (Malicious).'
  },
  {
    id: 'EVT-111',
    source: 'VPN Logs',
    timestamp: '2026-11-28T08:45:00Z',
    host: 'vpn-gw-01.perimeter',
    raw: 'User=sinta.dewi Tunnel=UP CertStatus=Valid PostureCheck=Compliant SplitTunnel=Disabled',
    classification: 'benign',
    rule: 'SOC-VPN-001: Compliant Remote Access Session',
    explanation: 'Sesi VPN menggunakan sertifikat valid dan perangkat lolos pemeriksaan postur keamanan (Benign).'
  },
  {
    id: 'EVT-112',
    source: 'VPN Logs',
    timestamp: '2026-11-28T14:10:40Z',
    host: 'vpn-gw-01.perimeter',
    raw: 'User=bima.saputra Event=MFA_Push_Denied_3x_Then_Approved SrcIP=198.51.100.31',
    classification: 'suspicious',
    rule: 'SOC-VPN-011: Potential MFA Fatigue Pattern',
    explanation: 'Beberapa penolakan push MFA diikuti persetujuan mendadak mengindikasikan kemungkinan MFA fatigue; perlu konfirmasi cepat ke user (Suspicious).'
  },
  {
    id: 'EVT-113',
    source: 'Endpoint Alerts',
    timestamp: '2026-11-28T02:11:04Z',
    host: 'srv-file-02.internal',
    raw: 'Process=vssadmin.exe Cmd="delete shadows /all /quiet" Parent=unknown_payload.exe',
    classification: 'malicious',
    rule: 'SOC-EDR-001: Shadow Copy Deletion (MITRE T1490)',
    explanation: 'Penghapusan seluruh Volume Shadow Copy oleh proses tak dikenal adalah indikator kuat persiapan Ransomware (Malicious).'
  },
  {
    id: 'EVT-114',
    source: 'Endpoint Alerts',
    timestamp: '2026-11-28T12:00:02Z',
    host: 'ws-dev-11.internal',
    raw: 'Process=git.exe Cmd="git pull origin main" Parent=Code.exe User=andarmax',
    classification: 'benign',
    rule: 'SOC-EDR-003: Standard Developer Version Control Activity',
    explanation: 'Perintah git pull yang dijalankan dari Visual Studio Code oleh akun developer adalah aktivitas sah (Benign).'
  },
  {
    id: 'EVT-115',
    source: 'Endpoint Alerts',
    timestamp: '2026-11-28T15:33:18Z',
    host: 'ws-hr-05.internal',
    raw: 'Process=powershell.exe Cmd="powershell -WindowStyle Hidden -Command Get-Process" Parent=WINWORD.EXE',
    classification: 'suspicious',
    rule: 'SOC-EDR-015: Office Application Spawning Hidden PowerShell',
    explanation: 'Dokumen Office yang memicu proses PowerShell tersembunyi merupakan pola anomali yang wajib diinvestigasi oleh SOC (Suspicious).'
  }
];

export class SIEMConsoleManager {
  constructor(game) {
    this.game = game;
    this.selectedSource = 'ALL';
    this.logOpenedAt = performance.now();
  }

  getFilteredLogs() {
    if (this.selectedSource === 'ALL') return SIEM_LOG_EVENTS;
    return SIEM_LOG_EVENTS.filter(e => e.source === this.selectedSource);
  }

  render() {
    const wrap = document.getElementById('siem-workspace');
    if (!wrap) return;

    const sources = [
      'ALL',
      'Authentication Logs',
      'Firewall Logs',
      'DNS Logs',
      'VPN Logs',
      'Endpoint Alerts'
    ];

    const pool = this.getFilteredLogs();
    const stats = this.game.state.siemStats;
    const currentEvent = pool[stats.totalTriaged % pool.length];
    const metrics = this.game.player.getSOCMetrics();
    this.logOpenedAt = performance.now();

    wrap.innerHTML = `
      <div class="card-title-row" style="margin-bottom:0.85rem;">
        <div class="lab-tabs" style="margin-bottom:0;">
          ${sources.map(src => `
            <button class="lab-tab siem-src-tab ${this.selectedSource === src ? 'active' : ''}" data-src="${escapeHTML(src)}">
              ${src === 'ALL' ? '📡 All Sources' : escapeHTML(src)}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="siem-telemetry-strip">
        <span>Triaged: <strong class="neon-blue">${stats.totalTriaged}</strong></span>
        <span>MTTD: <strong class="neon-green">${metrics.mttdMinutes}m</strong></span>
        <span>MTTR: <strong class="neon-purple">${metrics.mttrMinutes}m</strong></span>
        <span>False Positive Rate: <strong class="neon-amber">${metrics.falsePositiveRate}%</strong></span>
      </div>

      <div class="card glowing-card" style="margin-top:0.85rem;">
        <div class="card-title-row">
          <div>
            <span class="badge-neon">${escapeHTML(currentEvent.source)}</span>
            <span class="badge-diff">${escapeHTML(currentEvent.id)}</span>
          </div>
          <span class="mono-text">${escapeHTML(currentEvent.timestamp)} | Host: ${escapeHTML(currentEvent.host)}</span>
        </div>

        <p class="mono-text" style="margin-top:0.65rem; color:#93c5fd;">Rule Triggered: ${escapeHTML(currentEvent.rule)}</p>
        <div class="artifact-box">${escapeHTML(currentEvent.raw)}</div>

        <p style="margin-bottom:0.65rem;"><strong>Klasifikasi Analis SOC:</strong></p>
        <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
          <button class="btn btn-success btn-siem-classify" data-cls="benign">🟢 Classify: Benign</button>
          <button class="btn btn-outline btn-siem-classify" data-cls="suspicious" style="border-color:#ffb800; color:#ffb800;">🟡 Classify: Suspicious</button>
          <button class="btn btn-danger btn-siem-classify" data-cls="malicious">🔴 Classify: Malicious</button>
        </div>

        <div id="siem-feedback" class="feedback-box hidden"></div>
      </div>
    `;

    wrap.querySelectorAll('.siem-src-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        this.game.sound.click();
        this.selectedSource = btn.dataset.src;
        this.render();
      });
    });

    wrap.querySelectorAll('.btn-siem-classify').forEach(btn => {
      btn.addEventListener('click', () => this.evaluateClassification(currentEvent, btn.dataset.cls, btn));
    });
  }

  evaluateClassification(evt, chosen, clickedBtn) {
    document.querySelectorAll('.btn-siem-classify').forEach(b => (b.disabled = true));
    const decisionMs = Math.max(500, Math.min(60000, Math.round(performance.now() - this.logOpenedAt)));

    const stats = this.game.state.siemStats;
    stats.totalTriaged += 1;
    stats.totalDecisionMs += decisionMs;

    const isCorrect = chosen === evt.classification;
    const fb = document.getElementById('siem-feedback');
    fb.classList.remove('hidden');

    if (isCorrect) {
      if (evt.classification === 'benign') stats.trueNegatives += 1;
      else stats.truePositives += 1;

      clickedBtn.classList.add('correct');
      this.game.sound.success();
      const rew = this.game.player.grantRewards({ xp: 85, credits: 100, reputation: 1 });
      this.game.advanceDailyProgress('SIEM_TRIAGE', 1);

      fb.innerHTML = `
        <strong class="neon-green">✅ Klasifikasi Tepat (${evt.classification.toUpperCase()})! (+${rew.finalXP} XP, +₵ ${rew.finalCredits})</strong>
        <p style="margin-top:0.4rem;">${escapeHTML(evt.explanation)}</p>
        <button id="btn-next-siem-log" class="btn btn-sm btn-primary" style="margin-top:0.75rem;">Event Log Berikutnya →</button>
      `;
    } else {
      if (evt.classification === 'benign' && chosen !== 'benign') {
        stats.falsePositives += 1;
      } else if (evt.classification !== 'benign' && chosen === 'benign') {
        stats.falseNegatives += 1;
      }

      clickedBtn.classList.add('wrong');
      this.game.sound.warning();
      const repDelta = evt.classification === 'malicious' && chosen === 'benign' ? -3 : -1;
      this.game.player.grantRewards({ xp: 10, credits: 0, reputation: repDelta });

      fb.innerHTML = `
        <strong class="neon-red">⚠️ Klasifikasi Kurang Tepat (Seharusnya: ${evt.classification.toUpperCase()})</strong>
        <p style="margin-top:0.4rem;">${escapeHTML(evt.explanation)}</p>
        <button id="btn-next-siem-log" class="btn btn-sm btn-outline" style="margin-top:0.75rem;">Event Log Berikutnya →</button>
      `;
    }

    this.game.achievements.evaluateAll();
    this.game.autoSave(false);
    this.game.ui.renderHUD();
    this.game.ui.renderDashboard();

    document.getElementById('btn-next-siem-log')?.addEventListener('click', () => {
      this.render();
    });
  }
}
