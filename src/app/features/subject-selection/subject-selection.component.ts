import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MascotService } from '../../core/services/mascot.service';

interface SubjectCard {
  id: string;
  title: string;
  icon: string;
  color: string;
  gradient: string;
  route: string;
}

@Component({
  selector: 'app-subject-selection',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="selection-container">

      <!-- Back Button -->
      <button class="back-button" (click)="goBack()">
        <span class="back-icon">←</span>
      </button>

      <!-- Decorative Floating Icons -->
      <div class="floating-decorations">
        <div class="floating-icon icon-1">⭐</div>
        <div class="floating-icon icon-2">📚</div>
        <div class="floating-icon icon-3">✨</div>
        <div class="floating-icon icon-4">🎨</div>
        <div class="floating-icon icon-5">🌈</div>
        <div class="floating-icon icon-6">💡</div>
        <div class="floating-icon icon-7">🎵</div>
        <div class="floating-icon icon-8">🦋</div>
        <div class="floating-icon icon-9">🌟</div>
        <div class="floating-icon icon-10">🎈</div>
        <div class="floating-icon icon-11">🌸</div>
        <div class="floating-icon icon-12">☁️</div>
      </div>

      <!-- Header -->
      <div class="header">
        <h1 class="page-title">Chọn môn học nhé!</h1>
        <p class="page-subtitle">Bé muốn học môn gì hôm nay?</p>
      </div>

      <!-- Subject Cards Grid -->
      <div class="cards-grid">
        <div *ngFor="let subject of subjects"
             class="subject-card"
             [style.background]="subject.gradient"
             (click)="selectSubject(subject)"
             (mouseenter)="onCardHover(subject)"
             (mouseleave)="onCardLeave()">

          <div class="card-icon">{{ subject.icon }}</div>
          <h2 class="card-title">{{ subject.title }}</h2>

          <!-- Decorative shine effect -->
          <div class="card-shine"></div>
        </div>
      </div>

      <!-- Mascot Encouragement -->
      <div class="mascot-message" *ngIf="mascot.message()">
        <span class="mascot-icon">🦄</span>
        <p>{{ mascot.message() }}</p>
      </div>

    </div>
  `,
  styles: [`
    .selection-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #fef3c7 0%, #fce7f3 50%, #dbeafe 100%);
      padding: 40px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }

    .back-button {
      position: absolute;
      top: 30px;
      left: 30px;
      width: 56px;
      height: 56px;
      background: white;
      border: none;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      z-index: 10;
    }

    .back-button:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }

    .back-button:active {
      transform: scale(0.95);
    }

    .back-icon {
      font-size: 1.75rem;
      color: #8b5cf6;
      font-weight: bold;
    }

    .floating-decorations {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
      z-index: 1;
    }

    .floating-icon {
      position: absolute;
      font-size: 2.5rem;
      opacity: 0.15;
      animation: float-gentle 8s ease-in-out infinite;
    }

    /* Position each icon uniquely */
    .icon-1 { top: 10%; left: 8%; animation-delay: 0s; font-size: 2rem; }
    .icon-2 { top: 15%; right: 12%; animation-delay: 1s; font-size: 2.8rem; }
    .icon-3 { top: 25%; left: 15%; animation-delay: 2s; font-size: 2.2rem; }
    .icon-4 { top: 35%; right: 8%; animation-delay: 0.5s; font-size: 3rem; }
    .icon-5 { top: 45%; left: 5%; animation-delay: 1.5s; font-size: 2.5rem; }
    .icon-6 { top: 55%; right: 15%; animation-delay: 2.5s; font-size: 2rem; }
    .icon-7 { top: 65%; left: 10%; animation-delay: 3s; font-size: 2.8rem; }
    .icon-8 { top: 75%; right: 10%; animation-delay: 1.8s; font-size: 2.3rem; }
    .icon-9 { top: 20%; left: 50%; animation-delay: 2.2s; font-size: 2rem; }
    .icon-10 { top: 70%; left: 50%; animation-delay: 0.8s; font-size: 2.5rem; }
    .icon-11 { top: 40%; right: 25%; animation-delay: 1.2s; font-size: 2.6rem; }
    .icon-12 { top: 60%; left: 30%; animation-delay: 2.8s; font-size: 3.2rem; }

    @keyframes float-gentle {
      0%, 100% {
        transform: translateY(0px) translateX(0px) rotate(0deg);
      }
      25% {
        transform: translateY(-15px) translateX(10px) rotate(5deg);
      }
      50% {
        transform: translateY(-25px) translateX(-5px) rotate(-3deg);
      }
      75% {
        transform: translateY(-10px) translateX(8px) rotate(4deg);
      }
    }

    .header {
      text-align: center;
      margin-bottom: 60px;
      width: 100%;
      max-width: 900px;
    }

    .page-title {
      font-size: 3rem;
      font-weight: 900;
      background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 12px 0;
      animation: fadeIn 0.6s ease-out;
    }

    .page-subtitle {
      font-size: 1.25rem;
      color: #a855f7;
      font-weight: 600;
      margin: 0;
      animation: fadeIn 0.6s ease-out 0.2s backwards;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 30px;
      max-width: 900px;
      width: 100%;
      animation: fadeIn 0.8s ease-out 0.4s backwards;
    }

    .cards-grid .subject-card:last-child {
      grid-column: 2;
    }

    .subject-card {
      position: relative;
      padding: 40px 30px;
      border-radius: 24px;
      cursor: pointer;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 220px;
      border: 4px solid rgba(255, 255, 255, 0.5);
    }

    .subject-card:hover {
      transform: translateY(-12px) scale(1.05);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
      border-color: rgba(255, 255, 255, 0.8);
    }

    .subject-card:active {
      transform: translateY(-8px) scale(1.02);
    }

    .card-icon {
      font-size: 5rem;
      margin-bottom: 16px;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
      transition: transform 0.3s ease;
    }

    .subject-card:hover .card-icon {
      transform: scale(1.2) rotate(5deg);
    }

    .card-title {
      font-size: 1.75rem;
      font-weight: 900;
      color: white;
      margin: 0;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      position: relative;
      z-index: 2;
    }

    .card-shine {
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transform: translateX(-100%);
      transition: transform 0.6s ease;
    }

    .subject-card:hover .card-shine {
      transform: translateX(100%);
    }

    .mascot-message {
      margin-top: 40px;
      display: flex;
      align-items: center;
      gap: 12px;
      background: white;
      padding: 16px 28px;
      border-radius: 9999px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      animation: slideUp 0.5s ease-out 0.8s backwards;
    }

    .mascot-icon {
      font-size: 2rem;
    }

    .mascot-message p {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 700;
      color: #6b7280;
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 2rem;
      }

      .page-subtitle {
        font-size: 1rem;
      }

      .cards-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .cards-grid .subject-card:last-child {
        grid-column: 1;
      }

      .subject-card {
        min-height: 180px;
        padding: 30px 20px;
      }

      .card-icon {
        font-size: 4rem;
      }

      .card-title {
        font-size: 1.5rem;
      }
    }
  `]
})
export class SubjectSelectionComponent {
  private router = inject(Router);
  mascot = inject(MascotService);

  subjects: SubjectCard[] = [
    {
      id: 'math',
      title: 'Toán Học',
      icon: '🧮',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
      route: '/math'
    },
    {
      id: 'vietnamese',
      title: 'Tiếng Việt',
      icon: '📘',
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)',
      route: '/vietnamese'
    },
    {
      id: 'english',
      title: 'Tiếng Anh',
      icon: '🦁',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      route: '/english'
    },
    {
      id: 'games',
      title: 'Trò Chơi',
      icon: '🎮',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
      route: '/games'
    }
  ];

  selectSubject(subject: SubjectCard) {
    this.mascot.setEmotion('happy', `Tuyệt vời! Cùng học ${subject.title} nhé!`, 2000);
    setTimeout(() => {
      this.router.navigate([subject.route]);
    }, 500);
  }

  onCardHover(subject: SubjectCard) {
    const messages = [
      'Bé thích môn này à?',
      'Chọn đi bé!',
      'Môn này hay lắm!',
      'Cùng học nhé!'
    ];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    this.mascot.setEmotion('thinking', randomMsg, 1500);
  }

  onCardLeave() {
    this.mascot.message.set('');
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
