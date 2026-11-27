/**
 * QuizManager - 200+ Randomized Cybersecurity Questions Engine
 */
export class QuizManager {
  constructor(game, questionsData = []) {
    this.game = game;
    this.questions = Array.isArray(questionsData) && questionsData.length > 0
      ? questionsData
      : this.generateFallbackQuestions(200);
    this.sessionPool = [];
    this.currentIndex = 0;
    this.sessionScore = 0;
  }

  generateFallbackQuestions(count) {
    const domains = [
      'Cybersecurity Basics', 'Networking', 'Security Awareness', 'Digital Forensics',
      'Malware', 'Cloud Security', 'Risk Management', 'Threat Intelligence'
    ];
    const bank = [];
    for (let i = 1; i <= count; i++) {
      const cat = domains[(i - 1) % domains.length];
      bank.push({
        id: `QZ-${String(i).padStart(3, '0')}`,
        category: cat,
        question: `[${cat} #${i}] Manakah prinsip pertahanan keamanan informasi yang paling tepat diterapkan?`,
        options: [
          'Prinsip Least Privilege dan Defense in Depth',
          'Menggunakan satu password admin untuk semua sistem',
          'Menonaktifkan logging agar performa server meningkat',
          'Memberikan akses penuh jaringan publik ke database internal'
        ],
        answerIndex: 0,
        explanation: 'Least Privilege membatasi akses sesuai kebutuhan tugas, sedangkan Defense in Depth menyediakan lapisan kontrol berlapis.'
      });
    }
    return bank;
  }

  renderQuizHome() {
    const wrap = document.getElementById('quiz-container');
    if (!wrap) return;

    const categories = ['ALL', ...new Set(this.questions.map(q => q.category))];
    wrap.innerHTML = `
      <div class="card-title-row">
        <div>
          <h3>Total Bank Soal Tersedia: <span class="neon-blue">${this.questions.length} Soal</span></h3>
          <p class="subtitle">Pilih kategori dan jumlah soal acak untuk memulai sesi evaluasi.</p>
        </div>
      </div>
      <div class="filter-bar" style="margin: 1rem 0;">
        <select id="quiz-cat-select" class="cyber-select">
          ${categories.map(c => `<option value="${c}">${c === 'ALL' ? 'Semua Kategori (8 Domain)' : c}</option>`).join('')}
        </select>
        <select id="quiz-count-select" class="cyber-select">
          <option value="5">5 Soal</option>
          <option value="10" selected>10 Soal</option>
          <option value="20">20 Soal</option>
        </select>
        <button id="btn-start-quiz" class="btn btn-primary">Mulai Quiz Acak</button>
      </div>
    `;

    document.getElementById('btn-start-quiz').addEventListener('click', () => {
      this.game.sound.click();
      const cat = document.getElementById('quiz-cat-select').value;
      const cnt = Number(document.getElementById('quiz-count-select').value);
      this.startSession(cat, cnt);
    });
  }

  startSession(category, count) {
    const filtered = category === 'ALL'
      ? [...this.questions]
      : this.questions.filter(q => q.category === category);

    // Fisher-Yates shuffle
    for (let i = filtered.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
    }

    this.sessionPool = filtered.slice(0, Math.min(count, filtered.length));
    this.currentIndex = 0;
    this.sessionScore = 0;
    this.renderQuestion();
  }

  renderQuestion() {
    const wrap = document.getElementById('quiz-container');
    if (!wrap) return;

    if (this.currentIndex >= this.sessionPool.length) {
      wrap.innerHTML = `
        <h3>🎉 Sesi Quiz Selesai!</h3>
        <p class="briefing-box">Skor Sesi Anda: <strong class="neon-green">${this.sessionScore} / ${this.sessionPool.length}</strong></p>
        <button id="btn-quiz-again" class="btn btn-primary">Mainkan Sesi Baru</button>
      `;
      document.getElementById('btn-quiz-again').addEventListener('click', () => this.renderQuizHome());
      return;
    }

    const q = this.sessionPool[this.currentIndex];
    wrap.innerHTML = `
      <div class="card-title-row">
        <span class="badge-neon">${q.category}</span>
        <span class="mono-text">Soal ${this.currentIndex + 1} dari ${this.sessionPool.length}</span>
      </div>
      <h3 style="margin: 0.75rem 0 1rem;">${q.question}</h3>
      <div class="options-list">
        ${q.options.map((opt, idx) => `<button class="option-btn quiz-opt" data-idx="${idx}">${opt}</button>`).join('')}
      </div>
      <div id="quiz-explanation" class="feedback-box hidden"></div>
    `;

    wrap.querySelectorAll('.quiz-opt').forEach(btn => {
      btn.addEventListener('click', () => this.submitAnswer(Number(btn.dataset.idx), btn));
    });
  }

  submitAnswer(idx, btn) {
    const q = this.sessionPool[this.currentIndex];
    const isCorrect = idx === q.answerIndex;
    const stats = this.game.state.quizStats;
    stats.totalAnswered += 1;
    if (!stats.answeredIds.includes(q.id)) {
      stats.answeredIds.push(q.id);
    }

    const allBtns = document.querySelectorAll('.quiz-opt');
    allBtns.forEach(b => (b.disabled = true));

    const expBox = document.getElementById('quiz-explanation');
    expBox.classList.remove('hidden');

    if (isCorrect) {
      this.sessionScore += 1;
      stats.correctAnswers += 1;
      btn.classList.add('correct');
      this.game.sound.success();
      const reward = this.game.player.grantRewards({ xp: 55, credits: 70 });
      this.game.advanceDailyProgress('ANSWER_QUIZ', 1);
      expBox.innerHTML = `
        <strong class="neon-green">✅ Benar! (+${reward.finalXP} XP, +₵ ${reward.finalCredits})</strong>
        <p style="margin-top:0.35rem;">${q.explanation}</p>
        <button id="btn-next-q" class="btn btn-sm btn-primary" style="margin-top:0.75rem;">Soal Berikutnya →</button>
      `;
    } else {
      btn.classList.add('wrong');
      allBtns[q.answerIndex]?.classList.add('correct');
      this.game.sound.warning();
      expBox.innerHTML = `
        <strong class="neon-red">⚠️ Kurang Tepat</strong>
        <p style="margin-top:0.35rem;">${q.explanation}</p>
        <button id="btn-next-q" class="btn btn-sm btn-outline" style="margin-top:0.75rem;">Soal Berikutnya →</button>
      `;
    }

    this.game.achievements.evaluateAll();
    this.game.autoSave(false);
    this.game.ui.renderHUD();

    document.getElementById('btn-next-q').addEventListener('click', () => {
      this.currentIndex += 1;
      this.renderQuestion();
    });
  }
}
