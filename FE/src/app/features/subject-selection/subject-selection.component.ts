import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { KidButtonComponent } from '../../shared/ui-kit/kid-button/kid-button.component';
import { MascotService } from '../../core/services/mascot.service';
import { SubjectService } from '../../core/services/subject.service';
import { SubjectCard } from '../../core/models/subject.model';
import { GamificationStore } from '../../core/store/gamification.store';

@Component({
  selector: 'app-subject-selection',
  standalone: true,
  imports: [CommonModule, KidButtonComponent, RouterLink],
  template: `
    <div class="selection-container">

      <!-- Back Button -->
      <div class="back-button-wrapper">
        <kid-button (click)="goBack()" variant="neutral" size="md">
          ← Quay lại
        </kid-button>
      </div>

      <!-- Top Right Profile Button -->
      <a routerLink="/profile" class="profile-button">
        <div class="profile-content">
          <div class="profile-avatar">
            <img [src]="gameStore.profile().avatar" alt="Profile" class="avatar-img">
          </div>
          <div class="profile-name">
            {{ gameStore.profile().name }}
          </div>
        </div>
      </a>

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
        <div *ngFor="let subject of subjects$ | async"
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
      padding: 30px 20px 60px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      transform: translateZ(0);
    }

    .back-button-wrapper {
      position: absolute;
      top: 20px;
      left: 20px;
      z-index: 10;
    }

    .profile-button {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 10;
      text-decoration: none;
      transform: translateZ(0);
      transition: transform 0.3s ease;
    }

    .profile-button:hover {
      transform: scale(1.05);
    }

    .profile-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .profile-avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: 4px solid white;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      background: white;
    }

    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .profile-name {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(4px);
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 900;
      color: #8b5cf6;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border: 2px solid white;
      margin-top: -8px;
    }

    /* Removed old .back-button styles */

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
      margin-bottom: 30px;
      width: 100%;
      max-width: 1200px;
    }

    .page-title {
      font-size: 2.5rem;
      font-weight: 900;
      background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 8px 0;
      animation: fadeIn 0.6s ease-out;
    }

    .page-subtitle {
      font-size: 1.125rem;
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
      gap: 20px;
      max-width: 1200px;
      width: 100%;
      animation: fadeIn 0.8s ease-out 0.4s backwards;
    }



    .subject-card {
      position: relative;
      padding: 30px 20px;
      border-radius: 20px;
      cursor: pointer;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 180px;
      border: 4px solid rgba(255, 255, 255, 0.5);
      will-change: transform;
    }

    .subject-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2);
      border-color: rgba(255, 255, 255, 0.8);
    }

    .subject-card:active {
      transform: translateY(-6px) scale(1.02);
    }

    .card-icon {
      font-size: 4rem;
      margin-bottom: 12px;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
      transition: transform 0.3s ease;
    }

    .subject-card:hover .card-icon {
      transform: scale(1.15) rotate(5deg);
    }

    .card-title {
      font-size: 1.5rem;
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
      margin-top: 30px;
      display: flex;
      align-items: center;
      gap: 12px;
      background: white;
      padding: 14px 24px;
      border-radius: 9999px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      animation: slideUp 0.5s ease-out 0.8s backwards;
    }

    .mascot-icon {
      font-size: 1.75rem;
    }

    .mascot-message p {
      margin: 0;
      font-size: 1rem;
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
  private subjectService = inject(SubjectService);
  mascot = inject(MascotService);
  gameStore = inject(GamificationStore);

  subjects$ = this.subjectService.getSubjects();

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
