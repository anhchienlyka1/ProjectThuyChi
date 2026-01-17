import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface ExamSubject {
  id: string;
  name: string;
  icon: string;
  color: string;
  gradient: string;
  route: string;
  description: string;
}

@Component({
  selector: 'app-exam-subject-selection',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="exam-selection-container">
      <!-- Animated Background Elements -->
      <div class="floating-element element-1">📚</div>
      <div class="floating-element element-2">✏️</div>
      <div class="floating-element element-3">🎯</div>
      <div class="floating-element element-4">⭐</div>
      <div class="floating-element element-5">🏆</div>

      <!-- Header Section -->
      <div class="header-section">
        <button class="back-button" (click)="goBack()">
          <span class="back-icon">←</span>
          <span class="back-text">Quay lại</span>
        </button>

        <div class="title-container">
          <div class="graduation-cap">🎓</div>
          <h1 class="main-title">Chọn Môn Thi Nhé!</h1>
          <p class="subtitle">Bé muốn thi môn gì hôm nay? 🌟</p>
        </div>
      </div>

      <!-- Subjects Grid -->
      <div class="subjects-grid">
        <div
          *ngFor="let subject of subjects"
          class="subject-card"
          [style.background]="subject.gradient"
          (click)="selectSubject(subject)"
        >
          <div class="card-glow"></div>
          <div class="card-content">
            <div class="subject-icon">{{ subject.icon }}</div>
            <h2 class="subject-name">{{ subject.name }}</h2>
            <p class="subject-description">{{ subject.description }}</p>
            <div class="start-button">
              <span class="button-text">Bắt đầu thi</span>
              <span class="arrow">→</span>
            </div>
          </div>

          <!-- Decorative Stars -->
          <div class="card-stars">
            <span class="star star-1">✨</span>
            <span class="star star-2">⭐</span>
            <span class="star star-3">🌟</span>
          </div>
        </div>
      </div>

      <!-- Motivational Message -->
      <div class="motivation-box">
        <span class="motivation-icon">💪</span>
        <p class="motivation-text">Cố lên bé! Làm bài thi thật tốt nhé!</p>
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

    .exam-selection-container {
      height: 100vh;
      background: linear-gradient(135deg, #bae6fd 0%, #7dd3fc 50%, #38bdf8 100%);
      padding: 15px;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    /* Floating Background Elements */
    .floating-element {
      position: absolute;
      font-size: 2.5rem;
      opacity: 0.12;
      animation: float 15s ease-in-out infinite;
      pointer-events: none;
    }

    .element-1 {
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }

    .element-2 {
      top: 20%;
      right: 15%;
      animation-delay: 2s;
    }

    .element-3 {
      bottom: 20%;
      left: 15%;
      animation-delay: 4s;
    }

    .element-4 {
      top: 60%;
      right: 10%;
      animation-delay: 1s;
    }

    .element-5 {
      bottom: 10%;
      right: 20%;
      animation-delay: 3s;
    }

    @keyframes float {
      0%, 100% {
        transform: translate(0, 0) rotate(0deg);
      }
      25% {
        transform: translate(20px, -20px) rotate(5deg);
      }
      50% {
        transform: translate(-15px, -40px) rotate(-5deg);
      }
      75% {
        transform: translate(15px, -20px) rotate(3deg);
      }
    }

    /* Header Section */
    .header-section {
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
      flex-shrink: 0;
    }

    .back-button {
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 100;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: white;
      border: 2px solid #fbbf24;
      border-radius: 16px;
      padding: 10px 18px;
      font-size: 0.95rem;
      font-weight: 700;
      color: #92400e;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
    }

    .back-button:hover {
      transform: translateX(-5px) scale(1.05);
      box-shadow: 0 6px 20px rgba(251, 191, 36, 0.5);
      background: #fef3c7;
    }

    .back-icon {
      font-size: 1.3rem;
    }

    .title-container {
      text-align: center;
      animation: slideDown 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .graduation-cap {
      font-size: 3.5rem;
      margin-bottom: 8px;
      animation: bounce 2s ease-in-out infinite;
      display: inline-block;
      filter: drop-shadow(0 8px 16px rgba(146, 64, 14, 0.3));
    }

    @keyframes bounce {
      0%, 100% {
        transform: translateY(0) rotate(-5deg);
      }
      50% {
        transform: translateY(-15px) rotate(5deg);
      }
    }

    .main-title {
      font-size: 2.2rem;
      font-weight: 900;
      background: linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fbbf24 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 8px 0;
    }

    .subtitle {
      font-size: 1.1rem;
      font-weight: 700;
      color: #92400e;
      margin: 0;
    }

    /* Subjects Grid */
    .subjects-grid {
      max-width: 100%;
      margin: 0 auto;
      display: flex;
      flex-direction: row;
      gap: 25px;
      padding: 20px;
      flex: 1;
      overflow-x: auto;
      overflow-y: hidden;
      scroll-snap-type: x mandatory;
      scroll-behavior: smooth;
      -webkit-overflow-scrolling: touch;
    }

    /* Custom Scrollbar */
    .subjects-grid::-webkit-scrollbar {
      height: 8px;
    }

    .subjects-grid::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 10px;
    }

    .subjects-grid::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #f97316 0%, #fbbf24 100%);
      border-radius: 10px;
    }

    .subjects-grid::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #ea580c 0%, #f59e0b 100%);
    }

    .subject-card {
      position: relative;
      border-radius: 28px;
      padding: 35px 30px;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
      border: 3px solid rgba(255, 255, 255, 0.5);
      overflow: hidden;
      animation: cardSlideIn 0.6s ease-out backwards;
      min-width: 350px;
      flex-shrink: 0;
      scroll-snap-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .subject-card:nth-child(1) {
      animation-delay: 0.1s;
    }

    .subject-card:nth-child(2) {
      animation-delay: 0.2s;
    }

    .subject-card:nth-child(3) {
      animation-delay: 0.3s;
    }

    @keyframes cardSlideIn {
      from {
        opacity: 0;
        transform: translateY(40px) scale(0.9);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .card-glow {
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
      opacity: 0;
      transition: opacity 0.4s ease;
    }

    .subject-card:hover .card-glow {
      opacity: 1;
    }

    .subject-card:hover {
      transform: translateY(-8px) scale(1.03);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }

    .card-content {
      position: relative;
      z-index: 2;
      text-align: center;
    }

    .subject-icon {
      font-size: 5rem;
      margin-bottom: 20px;
      animation: iconFloat 3s ease-in-out infinite;
      display: inline-block;
      filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2));
    }

    @keyframes iconFloat {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-15px);
      }
    }

    .subject-name {
      font-size: 2rem;
      font-weight: 900;
      color: white;
      margin: 0 0 12px 0;
      text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    .subject-description {
      font-size: 1.05rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.95);
      margin: 0 0 25px 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .start-button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: white;
      padding: 10px 20px;
      border-radius: 16px;
      font-size: 1rem;
      font-weight: 800;
      color: #1e293b;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
    }

    .subject-card:hover .start-button {
      transform: scale(1.08);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    }

    .arrow {
      font-size: 1.2rem;
      transition: transform 0.3s ease;
    }

    .subject-card:hover .arrow {
      transform: translateX(5px);
    }

    /* Card Stars */
    .card-stars {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    .star {
      position: absolute;
      font-size: 1.3rem;
      opacity: 0;
      animation: starTwinkle 2s ease-in-out infinite;
    }

    .star-1 {
      top: 15%;
      left: 10%;
      animation-delay: 0s;
    }

    .star-2 {
      top: 20%;
      right: 15%;
      animation-delay: 0.5s;
    }

    .star-3 {
      bottom: 20%;
      left: 15%;
      animation-delay: 1s;
    }

    @keyframes starTwinkle {
      0%, 100% {
        opacity: 0;
        transform: scale(0.5) rotate(0deg);
      }
      50% {
        opacity: 1;
        transform: scale(1.2) rotate(180deg);
      }
    }

    .subject-card:hover .star {
      animation-play-state: running;
    }

    /* Motivation Box */
    .motivation-box {
      max-width: 600px;
      margin: 15px auto 0;
      background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
      border: 2px solid #fb923c;
      border-radius: 20px;
      padding: 12px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 8px 20px rgba(251, 146, 60, 0.3);
      animation: pulse 2s ease-in-out infinite;
      flex-shrink: 0;
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.02);
      }
    }

    .motivation-icon {
      font-size: 2rem;
      animation: rotate 3s linear infinite;
    }

    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .motivation-text {
      font-size: 1.05rem;
      font-weight: 800;
      color: #c2410c;
      margin: 0;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .subject-card {
        min-width: 320px;
        padding: 30px 25px;
      }

      .subject-icon {
        font-size: 4.5rem;
      }

      .subject-name {
        font-size: 1.8rem;
      }
    }

    @media (max-width: 768px) {
      .exam-selection-container {
        padding: 15px 10px;
      }

      .main-title {
        font-size: 1.8rem;
      }

      .subtitle {
        font-size: 1rem;
      }

      .graduation-cap {
        font-size: 3rem;
      }

      .subjects-grid {
        padding: 15px 10px;
        gap: 20px;
      }

      .subject-card {
        min-width: 280px;
        padding: 25px 20px;
      }

      .subject-icon {
        font-size: 4rem;
      }

      .subject-name {
        font-size: 1.6rem;
      }

      .subject-description {
        font-size: 0.95rem;
      }

      .start-button {
        padding: 12px 24px;
        font-size: 1rem;
      }

      .motivation-box {
        padding: 10px 15px;
      }

      .motivation-text {
        font-size: 0.95rem;
      }
    }
  `]
})
export class ExamSubjectSelectionComponent {
  subjects: ExamSubject[] = [
    {
      id: 'math',
      name: 'Toán Học',
      icon: '🔢',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #93c5fd 100%)',
      route: '/exam-practice/math',
      description: 'Kiểm tra kiến thức Toán'
    },
    {
      id: 'vietnamese',
      name: 'Tiếng Việt',
      icon: '📖',
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #fbcfe8 100%)',
      route: '/exam-practice/vietnamese',
      description: 'Kiểm tra kiến thức Tiếng Việt'
    },
    {
      id: 'english',
      name: 'Tiếng Anh',
      icon: '🦁',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fde68a 100%)',
      route: '/exam-practice/english',
      description: 'Kiểm tra kiến thức Tiếng Anh'
    }
  ];

  constructor(private router: Router) { }

  selectSubject(subject: ExamSubject): void {
    this.router.navigate([subject.route]);
  }

  goBack(): void {
    this.router.navigate(['/select-subject']);
  }
}
