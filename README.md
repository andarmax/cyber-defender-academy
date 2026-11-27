# 🛡️ Cyber Defender Academy

**Cyber Defender Academy** adalah game edukasi keamanan siber (*defensive cybersecurity & SOC simulation game*) berbasis web yang dijalankan langsung di browser tanpa backend maupun database eksternal, serta kompatibel penuh dengan **GitHub Pages** dan perangkat **desktop maupun mobile**.

Pemain memulai perjalanan karier dari **Cyber Security Intern** hingga mencapai posisi **Chief Information Security Officer (CISO)** melalui simulasi defensif yang legal, edukatif, dan terstruktur.

---

## ✨ Fitur Utama (Target Rilis Lengkap)

* **Career Mode (8 Tingkatan):** *Intern* $\rightarrow$ *Junior Analyst* $\rightarrow$ *Security Analyst* $\rightarrow$ *SOC Analyst* $\rightarrow$ *Security Engineer* $\rightarrow$ *Incident Responder* $\rightarrow$ *Security Architect* $\rightarrow$ *CISO*.
* **Leveling & Economy System:** Progres **XP**, **Level**, **Credits**, **Achievement Points (AP)**, **Reputation**, dan **Skill Points (SP)**.
* **Mission System (50+ Misi Unik):** Mencakup *Phishing Detection*, *Email Investigation*, *Password Security*, *Malware Identification*, *Incident Response*, *Risk Assessment*, *Security Awareness*, *Vulnerability Prioritization*, *Backup Recovery*, dan *Log Analysis*.
* **Interactive Cyber Labs:** Simulasi langsung untuk *Phishing Inspector*, *Password & MFA Lab* (indikator *Weak*, *Medium*, *Strong*, *Excellent*), *Digital Forensics*, *Malware Classifier* (*Ransomware*, *Trojan*, *Worm*, *Spyware*, *Adware*), dan *Network Defense*.
* **Cyber Quiz System (200+ Soal Acak):** Meliputi 8 domain keamanan informasi dengan sistem *auto-save* dan *local leaderboard* berbasis `localStorage`.
* **Audio Sintetis Web Audio API:** Efek suara (*click*, *success*, *warning*, *alert*) dan *ambient synth* opsional tanpa dependensi aset audio eksternal.

> **Catatan Keamanan & Etika:** Seluruh skenario, log, email, dan simulasi dalam proyek ini bersifat **edukatif, simulatif, legal, dan defensif** (*Blue Team*). Tidak memuat eksploitasi target nyata, *malware* aktif, maupun otomatisasi serangan.

---

## 📁 Struktur Folder Project

```text
cyber-defender-academy/
├── index.html
├── .nojekyll
├── README.md
├── LICENSE
├── css/
│   └── style.css
├── js/
│   ├── audio.js
│   ├── save.js
│   ├── player.js
│   ├── missions.js
│   ├── quiz.js
│   ├── skilltree.js
│   ├── inventory.js
│   ├── achievements.js
│   ├── leaderboard.js
│   ├── ui.js
│   └── game.js
├── data/
│   ├── questions.json
│   ├── missions.json
│   ├── achievements.json
│   └── items.json
└── assets/
    ├── images/
    ├── icons/
    └── audio/
