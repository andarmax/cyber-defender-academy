# Cyber Defender Academy (`CDA // SEC-OS`)

**Cyber Defender Academy** adalah simulator edukasi keamanan siber (*100% defensive & legal*) berbasis browser untuk melatih alur kerja *Blue Team*, analisis *Security Operations Center (SOC)*, dan pengembangan karier keamanan informasi dari level **Security Intern** hingga **Chief Information Security Officer (CISO)**.

- **Live Simulator:** https://andarmax.github.io/cyber-defender-academy/
- **Animated Promo Poster:** https://andarmax.github.io/cyber-defender-academy/promo.html

---

## Fitur Utama

- **50+ Defensive Missions:** Skenario investigasi insiden mencakup *phishing triage*, *hardening* kredensial, analisis log jaringan, forensik host, mitigasi malware, dan arsitektur pertahanan berlapis.
- **Pemetaan Standar Industri:** Setiap misi dipetakan langsung ke **NIST CSF**, **NIST SP 800-61**, **CIS Controls**, **CVSS**, **CWE**, dan **MITRE ATT&CK**.
- **Mini SIEM Console:** Simulasi korelasi dan triase log (*Auth, Firewall, DNS, VPN, Endpoint*) dengan pelacakan metrik operasional SOC secara *real-time*.
- **Threat Intelligence Center:** Modul analisis *Indicators of Compromise (IOC)*, reputasi hash/IP/domain, serta ringkasan kampanye ancaman siber.
- **5 Interactive Cyber Labs & 200+ Quiz Bank:** Laboratorium praktik interaktif dan bank evaluasi teknis untuk menguji ketajaman analisis defensif.
- **Certification Career Roadmap:** Jalur progresi sertifikasi industri (*Google Cybersecurity, CompTIA Security+, BTL1, Microsoft SC-900, SC-200, hingga CISSP*) lengkap dengan generator sertifikat kelulusan digital (`.png`).
- **Offline-Ready PWA & Local Save:** Penyimpanan progres otomatis di `localStorage` (skema save v4.3) dengan dukungan ekspor/impor JSON serta mode instalasi *Progressive Web App* (`manifest.json` + `sw.js`).

---

## Metrik Operasional SOC

Simulator mengevaluasi performa penanganan insiden menggunakan empat indikator utama SOC:

| Metrik | Deskripsi | Target Ideal |
| :--- | :--- | :--- |
| **MTTD** (*Mean Time to Detect*) | Rata-rata waktu deteksi sejak anomali muncul hingga alert teridentifikasi | `< 5 menit` (simulasi) |
| **MTTR** (*Mean Time to Respond*) | Rata-rata waktu isolasi dan remediasi insiden hingga status terkendali | `< 15 menit` (simulasi) |
| **Containment Rate** | Persentase insiden kritis yang berhasil dibendung sebelum eskalasi lateral | `≥ 90%` |
| **False Positive Rate** | Rasio alert jinak yang salah diklasifikasikan sebagai insiden berbahaya | `≤ 10%` |

---

## Struktur Direktori

```text
cyber-defender-academy/
├── index.html            # Antarmuka utama CDA // SEC-OS
├── promo.html            # Poster promosi beranimasi (3:4, 9:16, 16:9)
├── manifest.json         # Konfigurasi Progressive Web App (PWA)
├── sw.js                 # Service Worker untuk caching & mode offline
├── README.md             # Dokumentasi proyek
├── css/
│   └── style.css         # Desain cyber-HUD responsif (mobile & desktop)
└── js/
    ├── main.js           # Inisialisasi aplikasi & orkestrasi state
    ├── state.js          # Manajemen progres, XP, level & migrasi save
    ├── missions.js       # 50+ skenario misi & pemetaan framework keamanan
    ├── siem.js           # Engine Mini SIEM & kalkulasi metrik SOC
    ├── threatintel.js    # Modul Threat Intelligence & analisis IOC
    ├── labs.js           # 5 laboratorium simulasi interaktif
    ├── quiz.js           # Bank soal kuis & evaluasi kompetensi
    ├── skills.js         # Skill tree Blue Team & manajemen inventaris
    ├── career.js         # Jalur karier Intern–CISO & roadmap sertifikasi
    ├── achievements.js   # Sistem pencapaian & tantangan harian
    ├── ui.js             # Rendering komponen DOM & navigasi
    ├── audio.js          # Efek suara sintetis Web Audio API
    └── certificate.js    # Generator sertifikat digital PNG (HTML5 Canvas)
```

---

## Menjalankan Secara Lokal

Seluruh aplikasi dibangun menggunakan **HTML5, CSS3, dan Vanilla JavaScript (ES6 Modules)** tanpa *build step* atau dependensi eksternal, sehingga dapat dijalankan langsung melalui server statis apa pun:

```bash
git clone [https://github.com/andarmax/cyber-defender-academy.git](https://github.com/andarmax/cyber-defender-academy.git)
cd cyber-defender-academy
python3 -m http.server 8080
```

Buka `http://localhost:8080` di browser.

---

## Disclaimer

Seluruh skenario, alamat IP, domain, hash, dan log di dalam **Cyber Defender Academy** merupakan simulasi edukatif yang dirancang khusus untuk pelatihan keamanan defensif (*Blue Team*).