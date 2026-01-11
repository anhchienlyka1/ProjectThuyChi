import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MascotService } from '../../core/services/mascot.service';
import { GamificationStore } from '../../core/store/gamification.store';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">


        <!-- Floating decorative icons -->
        <div class="floating-icon star">⭐</div>
        <div class="floating-icon book">📖</div>
        <div class="floating-icon heart">💗</div>

        <!-- Main Content Container -->
        <div class="content-wrapper">

            <!-- Mascot/Avatar Section -->
            <div class="mascot-container" (click)="pokeMascot()">
                <div class="mascot-box">
                    <img src="/assets/images/avatar-girl.png"
                         alt="Mascot - Bé Thùy Chi"
                         class="mascot-img">
                </div>

                <!-- Emotion Bubble -->
                <div *ngIf="mascot.message()" class="emotion-bubble">
                    <p>{{ mascot.message() }}</p>
                </div>
            </div>

            <!-- Greeting Text -->
            <h1 class="main-heading">Chào bé yêu!</h1>

            <p class="subtitle">Hôm nay bé muốn học gì nào?</p>

            <!-- Main CTA Button -->
            <button (click)="startLearning()" class="cta-button">
                <span class="button-content">
                    <span class="icon-start">✨</span>
                    <span class="button-text">Bắt đầu học</span>
                    <span class="icon-arrow">→</span>
                </span>
                <div class="button-shine"></div>
            </button>

            <!-- Parents Link -->
            <button (click)="goToParentCorner()" class="parents-link">
                <span>👤</span>
                <span>Góc phụ huynh</span>
            </button>

        </div>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
      background: linear-gradient(180deg, #87CEEB 0%, #98D8C8 100%);
      background-image: url('/assets/images/grassy-hills-bg.jpg');
      background-size: 100% auto;
      background-position: center bottom;
      background-repeat: no-repeat;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }



    .floating-icon {
      position: absolute;
      font-size: 3rem;
      animation: float 6s ease-in-out infinite;
      z-index: 3;
    }

    .floating-icon.star {
      top: 80px;
      left: 80px;
      filter: drop-shadow(0 2px 4px rgba(255, 255, 255, 0.5));
      animation-delay: 0s;
    }

    .floating-icon.book {
      top: 60px;
      right: 80px;
      font-size: 3.5rem;
      filter: drop-shadow(0 2px 4px rgba(255, 255, 255, 0.5));
      animation-delay: 1s;
    }

    .floating-icon.heart {
      bottom: 160px;
      left: 60px;
      filter: drop-shadow(0 2px 4px rgba(255, 255, 255, 0.5));
      animation-delay: 2s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(5deg); }
    }

    .content-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;
      max-width: 600px;
      width: 100%;
      position: relative;
      z-index: 10;
    }

    .mascot-container {
      position: relative;
      cursor: pointer;
      margin-bottom: 20px;
    }

    .mascot-box {
      width: 200px;
      height: 200px;
      background: linear-gradient(135deg, #fef3c7 0%, #fef9e7 100%);
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .mascot-box:hover {
      transform: translateY(-8px);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
    }

    .mascot-img {
      width: 170px;
      height: 170px;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
    }

    .emotion-bubble {
      position: absolute;
      top: -60px;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      padding: 12px 20px;
      border-radius: 16px;
      border-bottom-left-radius: 0;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      z-index: 20;
      animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      white-space: nowrap;
    }

    .emotion-bubble p {
      margin: 0;
      color: #1f2937;
      font-weight: 700;
      font-size: 16px;
    }

    @keyframes popIn {
      from { opacity: 0; transform: translateX(-50%) scale(0.5); }
      to { opacity: 1; transform: translateX(-50%) scale(1); }
    }

    .main-heading {
      font-size: 3.5rem;
      font-weight: 900;
      background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0;
      text-align: center;
      animation: fadeIn 0.8s ease-out;
    }

    .subtitle {
      font-size: 1.5rem;
      color: #a855f7;
      font-weight: 600;
      margin: 0 0 30px 0;
      text-align: center;
      animation: fadeIn 0.8s ease-out 0.2s backwards;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .cta-button {
      position: relative;
      padding: 20px 48px;
      font-size: 1.75rem;
      font-weight: 900;
      color: white;
      background: linear-gradient(135deg, #f97316 0%, #ec4899 100%);
      border: none;
      border-radius: 9999px;
      box-shadow: 0 20px 40px rgba(249, 115, 22, 0.3);
      cursor: pointer;
      overflow: hidden;
      transition: all 0.3s ease;
      animation: fadeIn 0.8s ease-out 0.4s backwards;
    }

    .cta-button:hover {
      transform: translateY(-4px);
      box-shadow: 0 25px 50px rgba(249, 115, 22, 0.4);
    }

    .cta-button:active {
      transform: translateY(0);
    }

    .button-content {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .icon-start {
      font-size: 2rem;
    }

    .icon-arrow {
      font-size: 1.5rem;
      transition: transform 0.3s ease;
    }

    .cta-button:hover .icon-arrow {
      transform: translateX(4px);
    }

    .button-shine {
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transform: translateX(-100%);
      transition: transform 1s ease;
    }

    .cta-button:hover .button-shine {
      transform: translateX(100%);
    }

    .parents-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      font-size: 1.1rem;
      font-weight: 700;
      color: #9333ea;
      background: rgba(255, 255, 255, 0.7);
      border: 2px solid white;
      border-radius: 9999px;
      cursor: pointer;
      transition: all 0.3s ease;
      animation: fadeIn 0.8s ease-out 0.6s backwards;
      box-shadow: 0 4px 15px rgba(147, 51, 234, 0.1);
      backdrop-filter: blur(4px);
    }

    .parents-link:hover {
      color: #7c3aed;
      background: #ffffff;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(147, 51, 234, 0.2);
    }

    @media (max-width: 768px) {
      .main-heading {
        font-size: 2.5rem;
      }

      .subtitle {
        font-size: 1.25rem;
      }

      .cta-button {
        font-size: 1.5rem;
        padding: 16px 36px;
      }

      .mascot-box {
        width: 160px;
        height: 160px;
      }

      .mascot-img {
        width: 140px;
        height: 140px;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  mascot = inject(MascotService);
  gameStore = inject(GamificationStore);
  private router = inject(Router);

  ngOnInit() {
    setTimeout(() => {
      this.mascot.greet();
    }, 1000);
  }

  pokeMascot() {
    this.mascot.setEmotion('happy', 'Hihi, nhột quá!', true, 2000);
  }

  startLearning() {
    // Navigate to login with student type
    this.router.navigate(['/login'], { queryParams: { type: 'student' } });
  }

  goToParentCorner() {
    // Navigate to login with parent type
    this.router.navigate(['/login'], { queryParams: { type: 'parent' } });
  }
}
