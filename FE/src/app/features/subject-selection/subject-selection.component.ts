import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { KidButtonComponent } from '../../shared/ui-kit/kid-button/kid-button.component';
import { MascotService } from '../../core/services/mascot.service';
import { SubjectService } from '../../core/services/subject.service';
import { SubjectCard } from '../../core/models/subject.model';
import { GamificationStore } from '../../core/store/gamification.store';
import { DataSeedingService } from '../../core/services/data-seeding.service';


@Component({
  selector: 'app-subject-selection',
  standalone: true,
  imports: [CommonModule, KidButtonComponent, RouterLink],
  template: `
    <div class="selection-container">

      <!-- Animated Background Elements -->
      <div class="floating-elements">
        <span class="float-icon icon-1">⭐</span>
        <span class="float-icon icon-2">📚</span>
        <span class="float-icon icon-3">🎨</span>
        <span class="float-icon icon-4">🎵</span>
        <span class="float-icon icon-5">🌈</span>
        <span class="float-icon icon-6">🦋</span>
      </div>

      <!-- Clouds -->
      <div class="clouds">
        <div class="cloud cloud-1"></div>
        <div class="cloud cloud-2"></div>
        <div class="cloud cloud-3"></div>
      </div>
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

      <!-- Header -->
      <div class="header">
        <h1 class="page-title">Chọn môn học nhé!</h1>
        <p class="page-subtitle">Bé muốn học môn gì hôm nay?</p>
      </div>

      <!-- Subject Cards Grid -->
      <div class="cards-grid">
        <div *ngFor="let subject of subjects$ | async"
             class="subject-card"
             [class.disabled]="isDisabled(subject.id)"
             [style.background]="subject.gradient"
             (click)="selectSubject(subject)">

          <div class="card-icon">{{ subject.icon }}</div>
          <h2 class="card-title">{{ subject.title }}</h2>

          <!-- Coming Soon Badge for disabled subjects -->
          <div class="coming-soon-badge" *ngIf="isDisabled(subject.id)">Sắp ra mắt</div>

          <!-- Decorative shine effect -->
          <div class="card-shine"></div>
        </div>
      </div>
      <!-- Migrate Data Button (Dev Only) -->
      <div class="migrate-wrapper">
        <button (click)="migrateData()" class="migrate-btn" title="Migrate Mock Data to Firebase">
          🔄 Sync Data
        </button>
      </div>
    </div>
  `,
  styles: [`
    .migrate-wrapper {
        position: absolute;
        bottom: 20px;
        left: 20px;
        z-index: 100;
        opacity: 0.3;
        transition: opacity 0.3s;
    }
    .migrate-wrapper:hover {
        opacity: 1;
    }
    .migrate-btn {
        background: black;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 10px;
        cursor: pointer;
    }

    .selection-container {
      min-height: 100vh;
      background: linear-gradient(180deg, #bae6fd 0%, #7dd3fc 50%, #38bdf8 100%);
      padding: 30px 20px 60px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center; /* Center vertically */
      position: relative;
      overflow: hidden;
    }

    /* Floating Elements */
    .floating-elements {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 1;
    }

    .float-icon {
      position: absolute;
      font-size: 3rem;
      opacity: 0.2;
      animation: floatAround 20s ease-in-out infinite;
    }

    .icon-1 { top: 10%; left: 10%; animation-delay: 0s; }
    .icon-2 { top: 20%; right: 15%; animation-delay: 2s; }
    .icon-3 { bottom: 20%; left: 15%; animation-delay: 4s; }
    .icon-4 { top: 60%; right: 10%; animation-delay: 1s; }
    .icon-5 { bottom: 30%; right: 25%; animation-delay: 3s; }
    .icon-6 { top: 40%; left: 20%; animation-delay: 5s; }

    @keyframes floatAround {
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
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 1;
    }

    .cloud {
      position: absolute;
      background: rgba(255, 255, 255, 0.4);
      border-radius: 100px;
      animation: cloudDrift 40s linear infinite;
    }

    .cloud::before, .cloud::after {
      content: '';
      position: absolute;
      background: rgba(255, 255, 255, 0.4);
      border-radius: 100px;
    }

    .cloud-1 {
      width: 120px; height: 50px; top: 15%; left: -120px; animation-duration: 35s;
    }
    .cloud-1::before { width: 60px; height: 60px; top: -30px; left: 15px; }
    .cloud-1::after { width: 70px; height: 45px; top: -20px; right: 15px; }

    .cloud-2 {
      width: 140px; height: 55px; top: 50%; left: -140px; animation-duration: 40s; animation-delay: 10s;
    }
    .cloud-2::before { width: 65px; height: 65px; top: -32px; left: 20px; }
    .cloud-2::after { width: 75px; height: 50px; top: -22px; right: 20px; }

    .cloud-3 {
      width: 100px; height: 45px; top: 75%; left: -100px; animation-duration: 45s; animation-delay: 20s;
    }
    .cloud-3::before { width: 50px; height: 50px; top: -25px; left: 10px; }
    .cloud-3::after { width: 60px; height: 40px; top: -15px; right: 10px; }

    @keyframes cloudDrift {
      0% { left: -150px; }
      100% { left: 110%; }
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

    .header {
      text-align: center;
      margin-bottom: 40px;
      width: 100%;
      max-width: 1200px;
      z-index: 5;
      position: relative; /* Ensure above spline */
    }

    .page-title {
      font-size: 3rem;
      font-weight: 900;
      background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 10px 0;
      animation: fadeIn 0.6s ease-out;
      text-shadow: 0 4px 12px rgba(255,255,255,0.5); /* Make text pop against 3D */
    }

    .page-subtitle {
      font-size: 1.25rem;
      color: #7c3aed;
      font-weight: 700;
      margin: 0;
      animation: fadeIn 0.6s ease-out 0.2s backwards;
      text-shadow: 0 2px 4px rgba(255,255,255,0.5);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 40px;
      max-width: 1400px;
      width: 100%;
      animation: fadeIn 0.8s ease-out 0.4s backwards;
      margin-bottom: 40px;
      z-index: 5;
      position: relative; /* Ensure above spline */
    }

    .subject-card {
      position: relative;
      padding: 40px 30px;
      border-radius: 30px;
      cursor: pointer;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 300px;
      border: 4px solid rgba(255, 255, 255, 0.8);
      will-change: transform;
      background: rgba(255, 255, 255, 0.65); /* Increased opacity to mask 3D bg better */
      backdrop-filter: blur(16px) saturate(180%); /* Stronger blur */
    }

    .subject-card.disabled {
      opacity: 0.6;
      cursor: not-allowed;
      filter: grayscale(0.6);
    }

    .subject-card.disabled::after {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.2);
      z-index: 1;
    }

    .subject-card:not(.disabled):hover {
      transform: translateY(-10px) scale(1.03);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
      border-color: rgba(255, 255, 255, 0.9);
      z-index: 10;
    }

    .subject-card:not(.disabled):active {
      transform: translateY(-5px) scale(1.01);
    }

    .card-icon {
      font-size: 6rem;
      margin-bottom: 25px;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
      transition: transform 0.4s ease;
    }

    .subject-card:hover .card-icon {
      transform: scale(1.2) rotate(8deg);
    }

    .card-title {
      font-size: 2.2rem;
      font-weight: 900;
      color: white;
      margin: 0;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      position: relative;
      z-index: 2;
    }

    .coming-soon-badge {
      position: absolute;
      top: 15px;
      right: 15px;
      background: rgba(255, 255, 255, 0.95);
      color: #f59e0b;
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 0.85rem;
      font-weight: 900;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      z-index: 3;
      border: 2px solid #fbbf24;
    }

    .card-shine {
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
      transform: translateX(-100%);
      transition: transform 0.6s ease;
      pointer-events: none;
    }

    .subject-card:not(.disabled):hover .card-shine {
      transform: translateX(100%);
    }

    .mascot-message {
      position: absolute;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 12px;
      background: white;
      padding: 14px 24px;
      border-radius: 9999px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      animation: slideUp 0.3s ease-out backwards;
      z-index: 20;
      white-space: nowrap;
      pointer-events: none;
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

    .mascot-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 100;
      animation: slideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .mascot-box {
      width: 120px;
      height: 120px;
      background: linear-gradient(145deg, #ffffff 0%, #dbeafe 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
      border: 3px solid rgba(255, 255, 255, 0.8);
      position: relative;
      margin-top: 10px;
    }

    .mascot-img {
      width: 100px;
      height: 100px;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
    }

    .mascot-bubble {
      background: white;
      padding: 12px 20px;
      border-radius: 20px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
      margin-bottom: 10px;
      position: relative;
      max-width: 250px;
    }

    .mascot-bubble p {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 700;
      color: #1e40af;
    }

    .bubble-tail {
      position: absolute;
      bottom: -8px;
      left: 70%; /* Align somewhat with the mascot head */
      transform: translateX(-50%);
      width: 0; height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 8px solid white;
    }

    @keyframes slideUp {
      from { transform: translateY(50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    @media (max-width: 1200px) {

        .cards-grid {
            gap: 20px;
            padding: 0 20px;
        }
        .subject-card {
            min-height: 250px;
        }
    }

    @media (max-width: 768px) {
      .cards-grid {
        grid-template-columns: 1fr;
        max-width: 400px;
        gap: 20px;
      }
      .page-title {
        font-size: 2rem;
      }
      .subject-card {
        min-height: 180px;
        padding: 30px;
      }
      .card-icon {
        font-size: 4rem;
      }
    }
  `]
})
export class SubjectSelectionComponent {
  private router = inject(Router);
  private subjectService = inject(SubjectService);
  private dataSeeding = inject(DataSeedingService);
  mascot = inject(MascotService);
  gameStore = inject(GamificationStore);

  subjects$ = this.subjectService.getSubjects();

  // List of temporarily disabled subjects
  private disabledSubjects = ['fairy-tales', 'english', 'games']; // Temporarily lock games

  isDisabled(subjectId: string): boolean {
    return this.disabledSubjects.includes(subjectId);
  }

  selectSubject(subject: SubjectCard) {
    // Prevent navigation if subject is disabled
    if (this.isDisabled(subject.id)) {
      return;
    }

    setTimeout(() => {
      this.router.navigate([subject.route]);
    }, 500);
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  migrateData() {
    const shouldSeed = window.confirm('Are you sure you want to seed default data to Firebase? This might overwrite existing data with the same IDs.');
    if (shouldSeed) {
      this.dataSeeding.seedAllData();
    }
  }
}
