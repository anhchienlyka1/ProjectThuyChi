import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

interface Question {
  id: number;
  type: 'addition' | 'subtraction' | 'comparison';
  question: string;
  options: (number | string)[];
  correctAnswer: number | string;
  userAnswer?: number | string;
}

@Component({
  selector: 'app-math-exam',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('questionAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ],
  template: `
    <div class="exam-container">
      <!-- Animated Background Elements -->
      <div class="floating-math">
        <span class="math-symbol" style="top: 10%; left: 15%; animation-delay: 0s;">➕</span>
        <span class="math-symbol" style="top: 20%; right: 20%; animation-delay: 1s;">➖</span>
        <span class="math-symbol" style="top: 70%; left: 10%; animation-delay: 2s;">✖️</span>
        <span class="math-symbol" style="top: 60%; right: 15%; animation-delay: 3s;">➗</span>
        <span class="math-symbol" style="top: 40%; left: 25%; animation-delay: 1.5s;">🔢</span>
        <span class="math-symbol" style="top: 80%; right: 25%; animation-delay: 2.5s;">📐</span>
      </div>

      <div class="clouds">
        <div class="cloud cloud-1"></div>
        <div class="cloud cloud-2"></div>
        <div class="cloud cloud-3"></div>
      </div>

      <!-- Fixed Back Button -->
      <button class="back-button" (click)="goBack()" *ngIf="!examStarted">
        <span class="back-icon">←</span>
        <span class="back-text">Quay lại</span>
      </button>

      <!-- Start Screen -->
      <div class="start-screen" *ngIf="!examStarted && !showResults">
        <div class="start-content">
          <div class="exam-icon">📝</div>
          <h1 class="exam-title">Bài Thi Toán Học</h1>
          <p class="exam-description">Sẵn sàng làm bài thi chưa bé? 🌟</p>

          <div class="exam-info">
            <div class="info-card">
              <span class="info-icon">📊</span>
              <div class="info-content">
                <div class="info-label">Số câu hỏi</div>
                <div class="info-value">10 câu</div>
              </div>
            </div>

            <div class="info-card">
              <span class="info-icon">⏰</span>
              <div class="info-content">
                <div class="info-label">Thời gian</div>
                <div class="info-value">15 phút</div>
              </div>
            </div>

            <div class="info-card">
              <span class="info-icon">🎯</span>
              <div class="info-content">
                <div class="info-label">Điểm đạt</div>
                <div class="info-value">7/10</div>
              </div>
            </div>
          </div>

          <button class="start-exam-button" (click)="startExam()">
            <span class="button-icon">🚀</span>
            <span class="button-text">Bắt Đầu Thi</span>
          </button>

          <div class="tips-box">
            <span class="tips-icon">💡</span>
            <p class="tips-text">Hãy đọc kỹ đề và suy nghĩ thật kỹ trước khi chọn đáp án nhé!</p>
          </div>
        </div>
      </div>

      <!-- Exam Screen -->
      <div class="exam-screen" *ngIf="examStarted && !showResults">
        <!-- Header -->
        <div class="exam-header">
          <div class="progress-section">
            <div class="progress-label">
              <span class="question-count">Câu {{currentQuestionIndex + 1}}/{{questions.length}}</span>
              <span class="timer" [class.warning]="timeLeft < 60">
                <span class="timer-icon">⏱️</span>
                {{formatTime(timeLeft)}}
              </span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="progress"></div>
            </div>
          </div>
        </div>

        <!-- Question Card -->
        <div class="question-card" *ngIf="currentQuestion" [@questionAnimation]>
          <div class="question-number">Câu hỏi {{currentQuestionIndex + 1}}</div>
          <div class="question-text">{{currentQuestion.question}}</div>

          <div class="options-grid">
            <button
              *ngFor="let option of currentQuestion.options"
              class="option-button"
              [class.selected]="currentQuestion.userAnswer === option"
              [disabled]="currentQuestion.userAnswer !== undefined"
              (click)="selectAnswer(option)"
            >
              <span class="option-value">{{option}}</span>
            </button>
          </div>

          <!-- Only show submit button on last question -->
          <div class="submit-section" *ngIf="currentQuestionIndex === questions.length - 1 && currentQuestion.userAnswer !== undefined">
            <button class="submit-button" (click)="submitExam()">
              <span class="submit-icon">✓</span>
              <span class="submit-text">Nộp Bài Thi</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Results Screen -->
      <div class="results-screen" *ngIf="showResults">
        <div class="results-overlay"></div>
        <div class="results-content">
          <div class="trophy-section">
            <div class="trophy-animation" [class.gold]="score >= 9" [class.silver]="score >= 7 && score < 9" [class.bronze]="score < 7">
              <span class="trophy-icon">{{getTrophyIcon()}}</span>
            </div>
            <div class="header-text">
              <h1 class="results-title">{{getResultMessage()}}</h1>
              <p class="results-subtitle">{{getResultSubtitle()}}</p>
            </div>
          </div>

          <div class="score-container">
            <div class="score-circle">
              <div class="score-inner">
                <span class="score-value">{{score}}/{{questions.length}}</span>
                <span class="score-label">Điểm số</span>
              </div>
              <svg class="progress-ring" width="120" height="120">
                <circle class="progress-ring-bg" stroke="#e2e8f0" stroke-width="8" fill="transparent" r="52" cx="60" cy="60"/>
                <circle class="progress-ring-circle" [style.stroke-dashoffset]="calculateDashOffset()" stroke="#3b82f6" stroke-width="8" fill="transparent" r="52" cx="60" cy="60"/>
              </svg>
            </div>
          </div>

          <div class="stats-row">
            <div class="stat-item correct">
              <div class="stat-icon-wrapper">✓</div>
              <div class="stat-info">
                <span class="stat-val">{{correctAnswers}}</span>
                <span class="stat-lbl">Đúng</span>
              </div>
            </div>

            <div class="stat-item incorrect">
              <div class="stat-icon-wrapper">✗</div>
              <div class="stat-info">
                <span class="stat-val">{{questions.length - correctAnswers}}</span>
                <span class="stat-lbl">Sai</span>
              </div>
            </div>

            <div class="stat-item time">
              <div class="stat-icon-wrapper">⏱️</div>
              <div class="stat-info">
                <span class="stat-val">{{formatTime(900 - timeLeft)}}</span>
                <span class="stat-lbl">Thời gian</span>
              </div>
            </div>
          </div>

          <div class="action-buttons-compact">
            <button class="action-btn retry" (click)="retryExam()">
              <span class="btn-icon">🔄</span>
              Thi lại
            </button>
            <button class="action-btn home" (click)="goToHome()">
              <span class="btn-icon">🏠</span>
              Trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

    * {
      font-family: 'Nunito', sans-serif;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .exam-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #bae6fd 0%, #7dd3fc 50%, #38bdf8 100%);
      position: relative;
      overflow: hidden;
    }

    /* Floating Math Symbols */
    .floating-math {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 1;
    }

    .math-symbol {
      position: absolute;
      font-size: 3rem;
      opacity: 0.15;
      animation: floatSymbol 15s ease-in-out infinite;
    }

    @keyframes floatSymbol {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      25% { transform: translate(30px, -30px) rotate(90deg); }
      50% { transform: translate(-20px, -50px) rotate(180deg); }
      75% { transform: translate(20px, -30px) rotate(270deg); }
    }

    /* Clouds */
    .clouds {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
    .cloud {
      position: absolute;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 100px;
      animation: cloudFloat 30s linear infinite;
    }
    .cloud::before, .cloud::after {
      content: ''; position: absolute; background: inherit; border-radius: inherit;
    }
    .cloud-1 { width: 100px; height: 40px; top: 15%; left: -100px; animation-duration: 25s; }
    .cloud-1::before { width: 50px; height: 50px; top: -25px; left: 10px; }
    .cloud-1::after { width: 60px; height: 35px; top: -15px; right: 10px; }
    .cloud-2 { width: 120px; height: 45px; top: 40%; left: -120px; animation-duration: 30s; animation-delay: 5s; }
    .cloud-2::before { width: 55px; height: 55px; top: -28px; left: 15px; }
    .cloud-2::after { width: 65px; height: 40px; top: -18px; right: 15px; }
    .cloud-3 { width: 90px; height: 35px; top: 70%; left: -90px; animation-duration: 35s; animation-delay: 10s; }
    .cloud-3::before { width: 45px; height: 45px; top: -22px; left: 8px; }
    .cloud-3::after { width: 50px; height: 30px; top: -12px; right: 8px; }

    @keyframes cloudFloat {
      0% { left: -150px; } 100% { left: 110%; }
    }

    /* Back Button */
    .back-button {
      position: absolute; top: 20px; left: 20px; z-index: 100;
      display: inline-flex; align-items: center; gap: 8px;
      background: white; border: 2px solid #3b82f6; border-radius: 16px;
      padding: 8px 16px; font-size: 0.9rem; font-weight: 700; color: #1e40af;
      cursor: pointer; transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
    .back-button:hover { transform: translateX(-5px) scale(1.05); background: #dbeafe; }

    /* Start Screen */
    .start-screen {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      padding: 20px; position: relative; z-index: 10;
    }
    .start-content {
      background: white; border-radius: 32px; padding: 40px; max-width: 500px; width: 100%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15); text-align: center;
      animation: slideUp 0.6s ease-out;
    }
    .exam-icon { font-size: 4rem; margin-bottom: 15px; animation: bounce 2s infinite; }
    .exam-title {
      font-size: 2rem; font-weight: 900; margin-bottom: 8px;
      background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .exam-description { font-size: 1.1rem; color: #64748b; font-weight: 600; margin-bottom: 25px; }
    .exam-info {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 25px;
    }
    .info-card {
      background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 16px;
      padding: 12px 8px; display: flex; flex-direction: column; align-items: center;
    }
    .info-icon { font-size: 1.5rem; margin-bottom: 4px; }
    .info-label { font-size: 0.75rem; color: #64748b; font-weight: 600; }
    .info-value { font-size: 0.95rem; font-weight: 900; color: #1e40af; }

    .start-exam-button {
      width: 100%; padding: 15px; background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
      border: none; border-radius: 16px; color: white; font-size: 1.2rem; font-weight: 800;
      cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4); transition: all 0.3s ease; margin-bottom: 20px;
    }
    .start-exam-button:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(59, 130, 246, 0.5); }

    .tips-box {
      background: #fef3c7; border: 1px solid #fbbf24; border-radius: 12px;
      padding: 12px 15px; display: flex; align-items: center; gap: 10px;
    }
    .tips-icon { font-size: 1.2rem; }
    .tips-text { font-size: 0.85rem; color: #92400e; font-weight: 700; text-align: left; }

    /* Exam Screen */
    .exam-screen {
      min-height: 100vh; display: flex; flex-direction: column; padding: 20px;
      position: relative; z-index: 10; justify-content: center;
    }
    .exam-header { max-width: 700px; width: 100%; margin: 0 auto 20px; }
    .progress-section {
      background: white; border-radius: 16px; padding: 15px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
    .progress-label { display: flex; justify-content: space-between; margin-bottom: 8px; }
    .question-count { font-weight: 800; color: #1e40af; }
    .timer { display: flex; align-items: center; gap: 4px; font-weight: 800; color: #059669; }
    .timer.warning { color: #dc2626; animation: pulse 1s infinite; }
    .progress-bar { height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; }
    .progress-fill { height: 100%; background: #3b82f6; transition: width 0.3s ease; }

    .question-card {
      max-width: 700px; width: 100%; margin: 0 auto; background: white;
      border-radius: 24px; padding: 30px; box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
    }
    .question-number {
      display: inline-block; background: #e0f2fe; color: #0284c7;
      padding: 6px 16px; border-radius: 10px; font-size: 0.85rem; font-weight: 800; margin-bottom: 15px;
    }
    .question-text {
      font-size: 2.2rem; font-weight: 900; color: #1e293b;
      margin-bottom: 30px; text-align: center;
    }
    .options-grid {
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;
    }
    .option-button {
      background: white; border: 2px solid #cbd5e1; border-radius: 16px;
      padding: 20px; font-size: 1.5rem; font-weight: 800; color: #475569;
      cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 0 #cbd5e1;
    }
    .option-button:active:not(:disabled) { transform: translateY(4px); box-shadow: none; }
    .option-button:hover:not(:disabled) { border-color: #3b82f6; color: #3b82f6; }
    .option-button.selected {
      background: #3b82f6; border-color: #2563eb; color: white;
      box-shadow: 0 4px 0 #1d4ed8;
    }

    /* Results Screen - Compact Redesign */
    .results-screen {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      z-index: 50; display: flex; align-items: center; justify-content: center;
      padding: 20px;
    }
    .results-overlay {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);
    }
    .results-content {
      position: relative; background: white; border-radius: 30px;
      padding: 30px 40px; width: 100%; max-width: 420px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3); text-align: center;
      animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    @keyframes popIn {
      from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); }
    }

    .trophy-section { margin-bottom: 20px; }
    .trophy-animation { font-size: 4rem; margin-bottom: 10px; animation: trophyBounce 1s; }
    .header-text h1 { font-size: 1.8rem; margin-bottom: 4px; font-weight: 900; color: #1e293b; }
    .header-text p { font-size: 0.95rem; color: #64748b; font-weight: 600; padding: 0 10px; }

    .score-container {
      display: flex; justify-content: center; margin-bottom: 20px;
    }
    .score-circle {
      position: relative; width: 120px; height: 120px;
    }
    .score-inner {
      position: absolute; inset: 0; display: flex; flex-direction: column;
      align-items: center; justify-content: center; z-index: 2;
    }
    .score-value { font-size: 1.8rem; font-weight: 900; color: #3b82f6; line-height: 1; }
    .score-label { font-size: 0.75rem; font-weight: 700; color: #94a3b8; margin-top: 2px; }
    .progress-ring { transform: rotate(-90deg); }
    .progress-ring-circle { transition: stroke-dashoffset 1s ease-in-out; stroke-dasharray: 326; stroke-linecap: round; }

    /* Compact Stats Row */
    .stats-row {
      display: flex; justify-content: space-between; gap: 10px; margin-bottom: 25px;
    }
    .stat-item {
      flex: 1; background: #f8fafc; border-radius: 16px; padding: 10px;
      display: flex; flex-direction: column; align-items: center;
      border: 1px solid #e2e8f0;
    }
    .stat-item.correct { background: #f0fdf4; border-color: #bbf7d0; }
    .stat-item.incorrect { background: #fef2f2; border-color: #fecaca; }
    .stat-item.time { background: #fffbeb; border-color: #fde68a; }

    .stat-icon-wrapper {
      font-size: 1.2rem; margin-bottom: 4px;
      width: 32px; height: 32px; border-radius: 50%; background: white;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .stat-val { font-size: 1.1rem; font-weight: 800; color: #0f172a; }
    .stat-lbl { font-size: 0.7rem; font-weight: 700; color: #64748b; text-transform: uppercase; }

    .action-buttons-compact {
      display: flex; gap: 12px;
    }
    .action-btn {
      flex: 1; padding: 12px; border: none; border-radius: 14px;
      font-size: 1rem; font-weight: 800; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      transition: all 0.2s;
    }
    .action-btn.retry {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }
    .action-btn.home {
      background: white; border: 2px solid #e2e8f0; color: #64748b;
    }
    .action-btn:hover { transform: translateY(-2px); }
    .action-btn.retry:hover { box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4); }
    .action-btn.home:hover { border-color: #cbd5e1; background: #f8fafc; }

    @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
    @keyframes trophyBounce { 0% { transform: scale(0) rotate(-180deg); } 60% { transform: scale(1.2) rotate(10deg); } 100% { transform: scale(1) rotate(0deg); } }
  `]
})
export class MathExamComponent implements OnInit, OnDestroy {
  examStarted = false;
  showResults = false;
  questions: Question[] = [];
  currentQuestionIndex = 0;
  timeLeft = 900; // 15 minutes in seconds
  timerInterval: any;
  score = 0;
  correctAnswers = 0;

  constructor(private router: Router) { }

  ngOnInit() {
    this.generateQuestions();
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  calculateDashOffset(): number {
    const circumference = 2 * Math.PI * 52; // r=52
    const percentage = this.score / this.questions.length;
    return circumference - (percentage * circumference);
  }

  generateQuestions() {
    this.questions = [];
    const types: ('addition' | 'subtraction' | 'comparison')[] = ['addition', 'subtraction', 'comparison'];

    for (let i = 0; i < 10; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      this.questions.push(this.generateQuestion(i + 1, type));
    }
  }

  generateQuestion(id: number, type: 'addition' | 'subtraction' | 'comparison'): Question {
    let question = '';
    let correctAnswer: number | string = 0;
    let options: (number | string)[] = [];

    if (type === 'addition') {
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      correctAnswer = a + b;
      question = `${a} + ${b} = ?`;
    } else if (type === 'subtraction') {
      const a = Math.floor(Math.random() * 10) + 5;
      const b = Math.floor(Math.random() * a);
      correctAnswer = a - b;
      question = `${a} - ${b} = ?`;
    } else {
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      if (a > b) {
        correctAnswer = '>';
        question = `${a} __ ${b}`;
      } else if (a < b) {
        correctAnswer = '<';
        question = `${a} __ ${b}`;
      } else {
        correctAnswer = '=';
        question = `${a} __ ${b}`;
      }
    }

    // Generate options
    if (type === 'comparison') {
      options = ['>', '<', '=', '≠'];
      options.sort(() => Math.random() - 0.5);
    } else {
      options = [correctAnswer as number];
      while (options.length < 4) {
        const option = Math.max(0, (correctAnswer as number) + Math.floor(Math.random() * 10) - 5);
        if (!options.includes(option)) {
          options.push(option);
        }
      }
      options.sort(() => Math.random() - 0.5);
    }

    return { id, type, question, options, correctAnswer };
  }

  startExam() {
    this.examStarted = true;
    this.startTimer();
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.submitExam();
      }
    }, 1000);
  }

  get currentQuestion(): Question | undefined {
    return this.questions[this.currentQuestionIndex];
  }

  get progress(): number {
    return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
  }

  selectAnswer(answer: number | string) {
    if (this.currentQuestion && this.currentQuestion.userAnswer === undefined) {
      this.currentQuestion.userAnswer = answer;

      if (this.currentQuestionIndex < this.questions.length - 1) {
        setTimeout(() => {
          this.currentQuestionIndex++;
        }, 300);
      }
    }
  }

  submitExam() {
    clearInterval(this.timerInterval);
    this.calculateScore();
    this.showResults = true;
  }

  calculateScore() {
    this.correctAnswers = 0;
    this.questions.forEach(q => {
      if (q.userAnswer === q.correctAnswer) {
        this.correctAnswers++;
      }
    });
    this.score = this.correctAnswers;
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  getTrophyIcon(): string {
    if (this.score >= 9) return '🏆';
    if (this.score >= 7) return '🥈';
    return '🥉';
  }

  getResultMessage(): string {
    if (this.score >= 9) return 'Xuất Sắc!';
    if (this.score >= 7) return 'Giỏi Lắm!';
    if (this.score >= 5) return 'Khá Tốt!';
    return 'Cố Gắng Lên!';
  }

  getResultSubtitle(): string {
    if (this.score >= 9) return 'Bé thật tuyệt vời! Tiếp tục phát huy nhé! 🌟';
    if (this.score >= 7) return 'Bé đã làm rất tốt! Cố gắng thêm nữa nhé! 💪';
    if (this.score >= 5) return 'Bé đã cố gắng! Luyện tập thêm sẽ giỏi hơn!';
    return 'Đừng nản chí! Hãy thử lại, bé sẽ làm được!';
  }

  retryExam() {
    this.examStarted = false;
    this.showResults = false;
    this.currentQuestionIndex = 0;
    this.timeLeft = 900;
    this.score = 0;
    this.correctAnswers = 0;
    this.generateQuestions();
  }

  goToHome() {
    this.router.navigate(['/select-subject']);
  }

  goBack() {
    this.router.navigate(['/exam-practice']);
  }
}
