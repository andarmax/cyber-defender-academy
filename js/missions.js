/**
 * MissionManager - Handles 50+ Missions & 5 Interactive Defensive Cyber Labs
 */
export class MissionManager {
  constructor(game, missionsData = []) {
    this.game = game;
    this.missions = Array.isArray(missionsData) && missionsData.length > 0
      ? missionsData
      : this.getFallbackMissions();
    this.activeMission = null;
    this.currentLab = 'phishing';
    this.networkState = {
      dmzFirewall: false,
      vlanSegregation: false,
      dbEncryption: false,
      edrEndpoints: false
    };
  }

  getFallbackMissions() {
    const categories = [
      'Phishing Detection', 'Email Investigation', 'Password Security',
      'Malware Identification', 'Incident Response', 'Risk Assessment',
      'Security Awareness', 'Vulnerability Prioritization', 'Backup Recovery', 'Log Analysis'
    ];
    const list = [];
    for (let i = 1; i <= 50; i++) {
      const cat = categories[(i - 1) % categories.length];
      list.push({
        id: `MSN-${String(i).padStart(3, '0')}`,
        title: `Defensive Operation #${i}: ${cat}`,
        category: cat,
        difficulty: i <= 15 ? 'Intern' : i <= 35 ? 'Analyst' : 'Senior / Architect',
        briefing: `Simulasi defensif #${i} pada domain ${cat}. Pilih tindakan keamanan yang paling tepat dan sesuai SOP Blue Team.`,
        artifact: `[SOC-TELEMETRY #${i}] Source: Internal-Sim-Subnet | Status: Monitored | Policy: Defensive-Only`,
        options: [
          { text: 'Isolasi aset terdampak, verifikasi bukti log, dan terapkan mitigasi sesuai SOP', correct: true },
          { text: 'Abaikan peringatan tanpa pencatatan karena tidak ada dampak langsung', correct: false },
          { text: 'Nonaktifkan kontrol keamanan sementara untuk mempercepat akses', correct: false }
        ],
        explanation: 'Pendekatan defensif terbaik selalu memprioritaskan isolasi aman, dokumentasi bukti, dan mitigasi berbasis kebijakan.'
      });
    }
    return list;
  }

  renderMissionList() {
    const grid = document.getElementById('missions-grid');
    if (!grid) return;

    const catFilter = document.getElementById('mission-category-filter')?.value || 'ALL';
    const statusFilter = document.getElementById('mission-status-filter')?.value || 'ALL';
    const completedSet = new Set(this.game.state.completedMissions);

    const filtered = this.missions.filter(m => {
      const matchCat = catFilter === 'ALL' || m.category === catFilter;
      const isDone = completedSet.has(m.id);
      const matchStatus = statusFilter === 'ALL'
        || (statusFilter === 'COMPLETED' && isDone)
        || (statusFilter === 'AVAILABLE' && !isDone);
      return matchCat && matchStatus;
    });

    grid.innerHTML = filtered.map(m => {
      const done = completedSet.has(m.id);
      const xpReward = 120 + (m.difficulty === 'Analyst' ? 60 : m.difficulty === 'Senior / Architect' ? 130 : 0);
      const creditReward = 150 + (m.difficulty === 'Analyst' ? 80 : m.difficulty === 'Senior / Architect' ? 160 : 0);
      return `
        <div class="card glowing-card mission-card ${done ? 'completed' : ''}">
          <div>
            <div class="card-title-row">
              <span class="badge-neon">${m.category}</span>
              <span class="badge-diff">${m.difficulty}</span>
            </div>
            <h4>${m.title}</h4>
            <p class="briefing-box">${m.briefing}</p>
          </div>
          <div>
            <div class="reward-strip" style="margin-bottom:0.75rem;">
              <span class="neon-blue">+${xpReward} XP</span>
              <span class="neon-green">+₵ ${creditReward}</span>
              <span>${done ? '✅ Selesai' : '⏳ Aktif'}</span>
            </div>
            <button class="btn ${done ? 'btn-outline' : 'btn-primary'} btn-block btn-open-mission" data-id="${m.id}">
              ${done ? 'Ulangi Simulasi' : 'Jalankan Misi'}
            </button>
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.btn-open-mission').forEach(btn => {
      btn.addEventListener('click', () => {
        this.game.sound.click();
        this.openMission(btn.dataset.id);
      });
    });
  }

  openMission(missionId) {
    const mission = this.missions.find(m => m.id === missionId);
    if (!mission) return;
    this.activeMission = mission;

    document.getElementById('m-modal-cat').textContent = mission.category;
    document.getElementById('m-modal-diff').textContent = mission.difficulty;
    document.getElementById('m-modal-title').textContent = mission.title;
    document.getElementById('m-modal-briefing').textContent = mission.briefing;
    document.getElementById('m-modal-artifact').textContent = mission.artifact;

    const feedbackBox = document.getElementById('m-modal-feedback');
    feedbackBox.classList.add('hidden');
    feedbackBox.innerHTML = '';

    const optionsWrap = document.getElementById('m-modal-options');
    optionsWrap.innerHTML = mission.options.map((opt, idx) => `
      <button class="option-btn" data-idx="${idx}">${opt.text}</button>
    `).join('');

    optionsWrap.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => this.evaluateMissionChoice(Number(btn.dataset.idx), btn));
    });

    document.getElementById('mission-modal').classList.remove('hidden');
  }

  evaluateMissionChoice(choiceIdx, clickedBtn) {
    const mission = this.activeMission;
    if (!mission) return;
    const chosen = mission.options[choiceIdx];
    const allBtns = document.querySelectorAll('#m-modal-options .option-btn');
    allBtns.forEach(b => (b.disabled = true));

    const feedbackBox = document.getElementById('m-modal-feedback');
    feedbackBox.classList.remove('hidden');

    if (chosen && chosen.correct) {
      clickedBtn.classList.add('correct');
      this.game.sound.success();
      const firstTime = !this.game.state.completedMissions.includes(mission.id);
      if (firstTime) {
        this.game.state.completedMissions.push(mission.id);
      }
      const baseXP = firstTime ? 150 : 40;
      const baseCredits = firstTime ? 200 : 50;
      const reward = this.game.player.grantRewards({
        xp: baseXP,
        credits: baseCredits,
        reputation: firstTime ? 3 : 1
      });
      this.game.advanceDailyProgress('COMPLETE_MISSION', 1);
      this.game.achievements.evaluateAll();
      this.game.autoSave(false);
      this.game.refreshAllViews();

      feedbackBox.innerHTML = `
        <strong class="neon-green">✅ Analisis Tepat!</strong> (+${reward.finalXP} XP, +₵ ${reward.finalCredits})<br/>
        <p style="margin-top:0.4rem;">${mission.explanation}</p>
      `;
    } else {
      clickedBtn.classList.add('wrong');
      this.game.sound.warning();
      this.game.player.grantRewards({ xp: 20, credits: 0, reputation: -2 });
      this.game.autoSave(false);
      this.game.ui.renderHUD();

      feedbackBox.innerHTML = `
        <strong class="neon-red">⚠️ Respons Kurang Tepat (-2% Reputation)</strong><br/>
        <p style="margin-top:0.4rem;">${mission.explanation}</p>
      `;
    }
  }

  /* ========================================================================
     INTERACTIVE CYBER LABS (5 MODES)
     ======================================================================== */
  renderLab(labName) {
    this.currentLab = labName;
    const container = document.getElementById('lab-workspace');
    if (!container) return;

    if (labName === 'phishing') this.renderPhishingLab(container);
    else if (labName === 'password') this.renderPasswordLab(container);
    else if (labName === 'forensics') this.renderForensicsLab(container);
    else if (labName === 'malware') this.renderMalwareLab(container);
    else if (labName === 'network') this.renderNetworkLab(container);
  }

  renderPhishingLab(container) {
    const samples = [
      {
        from: 'IT Support <admin@nusantara-sso-verify-login.example>',
        subject: 'URGENT: Akun SSO Anda Akan Diblokir Dalam 2 Jam',
        body: 'Klik tautan darurat berikut untuk memverifikasi kredensial Anda segera: http://bit.ly/sim-verify-sso',
        isPhishing: true,
        reason: 'Domain pengirim bukan domain resmi perusahaan dan menggunakan taktik urgensi + tautan pemendek mencurigakan.'
      },
      {
        from: 'HRIS Notification <hris@perusahaan.co.id>',
        subject: 'Jadwal Onboarding Karyawan Baru Bulan Ini',
        body: 'Halo tim, silakan cek jadwal sesi pengenalan kebijakan keamanan informasi internal melalui portal intranet resmi.',
        isPhishing: false,
        reason: 'Domain internal sesuai, tidak meminta kredensial, dan mengarah ke portal internal resmi.'
      }
    ];
    const sample = samples[this.game.state.labStats.phishingSolved % samples.length];

    container.innerHTML = `
      <h3>📧 Phishing & Email Investigation Simulator</h3>
      <p class="subtitle">Periksa header, pengirim, dan isi pesan simulasi sebelum menentukan klasifikasi.</p>
      <div class="email-sim-box">
        <div class="email-header-line"><strong>From:</strong> ${sample.from}</div>
        <div class="email-header-line"><strong>Subject:</strong> ${sample.subject}</div>
        <div style="margin-top:0.75rem;">${sample.body}</div>
      </div>
      <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
        <button id="btn-mark-phish" class="btn btn-danger">🚨 Klasifikasikan: PHISHING</button>
        <button id="btn-mark-legit" class="btn btn-success">✅ Klasifikasikan: LEGITIMATE</button>
      </div>
      <div id="lab-result" class="feedback-box hidden"></div>
    `;

    const handleAnswer = (userSaysPhish) => {
      const correct = userSaysPhish === sample.isPhishing;
      const resBox = document.getElementById('lab-result');
      resBox.classList.remove('hidden');
      if (correct) {
        this.game.state.labStats.phishingSolved += 1;
        this.game.player.grantRewards({ xp: 90, credits: 110, reputation: 1 });
        this.game.advanceDailyProgress('SOLVE_LAB', 1);
        this.game.sound.success();
        resBox.innerHTML = `<strong class="neon-green">✅ Tepat! (+90 XP, +₵ 110)</strong><p>${sample.reason}</p>`;
      } else {
        this.game.sound.warning();
        resBox.innerHTML = `<strong class="neon-red">⚠️ Kurang Tepat</strong><p>${sample.reason}</p>`;
      }
      this.game.achievements.evaluateAll();
      this.game.autoSave(false);
      this.game.ui.renderHUD();
    };

    document.getElementById('btn-mark-phish').addEventListener('click', () => handleAnswer(true));
    document.getElementById('btn-mark-legit').addEventListener('click', () => handleAnswer(false));
  }

  renderPasswordLab(container) {
    container.innerHTML = `
      <h3>🔐 Password Policy, Strength & MFA Evaluator</h3>
      <p class="subtitle">Uji kekuatan passphrase dan aktifkan Multi-Factor Authentication (MFA) sesuai standar keamanan.</p>
      <div class="form-group" style="margin-top:1rem;">
        <label for="pwd-lab-input">Masukkan Passphrase Simulasi:</label>
        <input type="text" id="pwd-lab-input" placeholder="Contoh: Defend-Perimeter#2026!Safe" style="width:100%; margin-top:0.4rem;" />
      </div>
      <div class="pwd-meter-bar">
        <div id="pwd-strength-fill" class="pwd-meter-fill"></div>
      </div>
      <div class="card-title-row">
        <span id="pwd-strength-label" class="mono-text">Strength: Weak</span>
        <label style="display:flex; align-items:center; gap:0.45rem; cursor:pointer;">
          <input type="checkbox" id="mfa-toggle" checked />
          <span>Hardware / Authenticator MFA Enabled</span>
        </label>
      </div>
      <button id="btn-verify-policy" class="btn btn-primary" style="margin-top:0.5rem;">Verifikasi Kepatuhan Kebijakan</button>
      <div id="pwd-feedback" class="feedback-box hidden"></div>
    `;

    const input = document.getElementById('pwd-lab-input');
    const bar = document.getElementById('pwd-strength-fill');
    const label = document.getElementById('pwd-strength-label');

    const calcScore = (val) => {
      let score = 0;
      if (val.length >= 8) score += 25;
      if (val.length >= 14) score += 25;
      if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score += 20;
      if (/\d/.test(val)) score += 15;
      if (/[^A-Za-z0-9]/.test(val)) score += 15;
      return Math.min(100, score);
    };

    input.addEventListener('input', () => {
      const s = calcScore(input.value);
      bar.style.width = `${s}%`;
      if (s < 35) {
        bar.style.background = '#ff3b5c';
        label.textContent = 'Strength: Weak';
      } else if (s < 65) {
        bar.style.background = '#ffb800';
        label.textContent = 'Strength: Medium';
      } else if (s < 90) {
        bar.style.background = '#00f0ff';
        label.textContent = 'Strength: Strong';
      } else {
        bar.style.background = '#00ff88';
        label.textContent = 'Strength: Excellent';
      }
    });

    document.getElementById('btn-verify-policy').addEventListener('click', () => {
      const s = calcScore(input.value);
      const mfa = document.getElementById('mfa-toggle').checked;
      const fb = document.getElementById('pwd-feedback');
      fb.classList.remove('hidden');

      if (s >= 65 && mfa) {
        this.game.player.grantRewards({ xp: 85, credits: 100 });
        this.game.advanceDailyProgress('SOLVE_LAB', 1);
        this.game.sound.success();
        fb.innerHTML = `<strong class="neon-green">✅ Kebijakan Terpenuhi! (+85 XP, +₵ 100)</strong><p>Kombinasi panjang/kompleksitas kredensial dan MFA aktif secara drastis mengurangi risiko kompromi akun.</p>`;
      } else {
        this.game.sound.warning();
        fb.innerHTML = `<strong class="neon-amber">⚠️ Perlu Peningkatan</strong><p>Gunakan password minimal Strong (panjang ≥12-14 karakter, variasi huruf/angka/simbol) dan pastikan MFA aktif.</p>`;
      }
      this.game.autoSave(false);
      this.game.ui.renderHUD();
    });
  }

  renderForensicsLab(container) {
    container.innerHTML = `
      <h3>🔍 Digital Forensics — Timeline & Log Artifact</h3>
      <p class="subtitle">Susun urutan kejadian berdasarkan timestamp log simulasi insiden.</p>
      <div class="artifact-box">[02:14:01] AUTH_LOG: Failed login burst on VPN gateway (Source: Sim-Ext-IP-198.51.100.44)
[02:15:10] AUTH_LOG: Valid session established after MFA challenge passed by svc_backup
[02:16:42] FILE_LOG: Unexpected archive created in /tmp/sim_snapshot.tar.gz by svc_backup
[02:17:05] NET_LOG: Outbound TLS connection blocked by Egress Policy to Sim-C2-Sinkhole</div>
      <p style="margin-bottom:0.6rem;"><strong>Langkah Forensik Pertama yang Paling Tepat:</strong></p>
      <button id="btn-forensics-ok" class="btn btn-primary">Amankan image memori/log, catat hash bukti, & isolasi sesi svc_backup</button>
      <div id="forensics-fb" class="feedback-box hidden"></div>
    `;

    document.getElementById('btn-forensics-ok').addEventListener('click', () => {
      this.game.state.labStats.forensicsSolved += 1;
      this.game.player.grantRewards({ xp: 110, credits: 130, reputation: 2 });
      this.game.advanceDailyProgress('SOLVE_LAB', 1);
      this.game.sound.success();
      this.game.achievements.evaluateAll();
      this.game.autoSave(false);
      this.game.ui.renderHUD();
      const fb = document.getElementById('forensics-fb');
      fb.classList.remove('hidden');
      fb.innerHTML = `<strong class="neon-green">✅ Chain of Custody Terjaga! (+110 XP, +₵ 130)</strong><p>Menjaga integritas bukti forensik dan mengisolasi akun layanan mencurigakan mencegah eskalasi lebih lanjut.</p>`;
    });
  }

  renderMalwareLab(container) {
    const cases = [
      { type: 'Ransomware', symptom: 'Banyak berkas dokumen berubah ekstensi secara massal dan muncul catatan pemulihan sistem.' },
      { type: 'Worm', symptom: 'Program menyebar otomatis ke host lain di jaringan internal tanpa perlu aksi klik pengguna berulang.' },
      { type: 'Spyware', symptom: 'Proses latar belakang diam-diam merekam aktivitas/telemetri pengguna dan mengirimkannya keluar.' },
      { type: 'Trojan', symptom: 'Utilitas tampak seperti aplikasi produktivitas sah, namun menyembunyikan fungsi tersembunyi di dalamnya.' },
      { type: 'Adware', symptom: 'Menampilkan iklan pop-up atau injeksi banner berlebihan pada browser pengguna.' }
    ];
    const idx = this.game.state.labStats.malwareSolved % cases.length;
    const target = cases[idx];

    container.innerHTML = `
      <h3>🦠 Malware Behavioral Classification Lab</h3>
      <p class="subtitle">Identifikasi jenis ancaman berdasarkan perilaku simulasi defensif berikut:</p>
      <div class="artifact-box">GEJALA TERDETEKSI:\n${target.symptom}</div>
      <div style="display:flex; gap:0.55rem; flex-wrap:wrap;">
        ${cases.map(c => `<button class="btn btn-outline btn-malware-pick" data-type="${c.type}">${c.type}</button>`).join('')}
      </div>
      <div id="malware-fb" class="feedback-box hidden"></div>
    `;

    container.querySelectorAll('.btn-malware-pick').forEach(btn => {
      btn.addEventListener('click', () => {
        const fb = document.getElementById('malware-fb');
        fb.classList.remove('hidden');
        if (btn.dataset.type === target.type) {
          this.game.state.labStats.malwareSolved += 1;
          this.game.player.grantRewards({ xp: 100, credits: 120 });
          this.game.advanceDailyProgress('SOLVE_LAB', 1);
          this.game.sound.success();
          this.game.achievements.evaluateAll();
          this.game.autoSave(false);
          this.game.ui.renderHUD();
          fb.innerHTML = `<strong class="neon-green">✅ Klasifikasi Benar: ${target.type}! (+100 XP, +₵ 120)</strong>`;
        } else {
          this.game.sound.warning();
          fb.innerHTML = `<strong class="neon-red">⚠️ Belum Tepat</strong><p>Coba perhatikan kembali karakteristik utama dari gejala yang muncul.</p>`;
        }
      });
    });
  }

  renderNetworkLab(container) {
    const nodes = [
      { key: 'dmzFirewall', label: 'DMZ Ingress Firewall', desc: 'Batasi port publik hanya ke layanan web terverifikasi.' },
      { key: 'vlanSegregation', label: 'VLAN Network Segmentation', desc: 'Pisahkan segmen staf, server aplikasi, dan database.' },
      { key: 'dbEncryption', label: 'Database & Backup Protection', desc: 'Aktifkan enkripsi data dan backup terisolasi.' },
      { key: 'edrEndpoints', label: 'Endpoint & Server Hardening', desc: 'Terapkan least privilege dan pemantauan endpoint.' }
    ];

    container.innerHTML = `
      <h3>🌐 Network Defense & Segmentation Topology</h3>
      <p class="subtitle">Amankan seluruh lapisan infrastruktur jaringan perusahaan.</p>
      <div class="net-nodes-grid">
        ${nodes.map(n => {
          const active = this.networkState[n.key];
          return `
            <div class="net-node-card ${active ? 'secured' : ''}">
              <h4>${n.label}</h4>
              <p class="subtitle" style="margin:0.4rem 0 0.8rem;">${n.desc}</p>
              <button class="btn btn-sm ${active ? 'btn-success' : 'btn-primary'} btn-toggle-node" data-key="${n.key}">
                ${active ? '🛡️ Secured' : 'Apply Defense'}
              </button>
            </div>
          `;
        }).join('')}
      </div>
      <div id="net-fb" class="feedback-box hidden"></div>
    `;

    container.querySelectorAll('.btn-toggle-node').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.key;
        this.networkState[key] = !this.networkState[key];
        this.game.sound.click();
        this.renderNetworkLab(container);

        const allSecured = Object.values(this.networkState).every(Boolean);
        if (allSecured) {
          this.game.state.labStats.networkHardened += 1;
          this.game.player.grantRewards({ xp: 140, credits: 180, reputation: 3 });
          this.game.advanceDailyProgress('SOLVE_LAB', 1);
          this.game.sound.success();
          this.game.achievements.evaluateAll();
          this.game.autoSave(false);
          this.game.ui.renderHUD();
          const fb = document.getElementById('net-fb');
          fb.classList.remove('hidden');
          fb.innerHTML = `<strong class="neon-green">✅ Seluruh Segmen Jaringan Terlindungi! (+140 XP, +₵ 180)</strong>`;
          // Reset state agar bisa dilatih ulang
          Object.keys(this.networkState).forEach(k => (this.networkState[k] = false));
        }
      });
    });
  }
}
