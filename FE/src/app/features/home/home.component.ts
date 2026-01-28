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

      <!-- Main Content -->
      <div class="content-wrapper">
        <!-- Mascot Section -->
        <div class="mascot-section" (click)="pokeMascot()">
          <div class="mascot-box">
            <img src="/assets/images/avatar-girl.png" alt="Mascot" class="mascot-img">
            <div class="mascot-glow"></div>
          </div>

          <!-- Emotion Bubble -->
          <div *ngIf="mascot.message()" class="emotion-bubble">
            <p>{{ mascot.message() }}</p>
            <div class="bubble-tail"></div>
          </div>
        </div>

        <!-- Welcome Text -->
        <div class="welcome-section">
          <h1 class="main-title">Chào Bé Yêu!</h1>
          <p class="subtitle">Hôm nay bé muốn học gì nào? 🌟</p>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button class="start-button" (click)="startLearning()">
            <span class="button-icon">🚀</span>
            <span class="button-text">Bắt Đầu Học</span>
            <span class="button-arrow">→</span>
            <div class="button-ripple"></div>
          </button>
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

    .home-container {
      min-height: 100vh;
      background: linear-gradient(180deg, #bae6fd 0%, #7dd3fc 50%, #38bdf8 100%);
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
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

    .icon-1 {
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }

    .icon-2 {
      top: 20%;
      right: 15%;
      animation-delay: 2s;
    }

    .icon-3 {
      bottom: 20%;
      left: 15%;
      animation-delay: 4s;
    }

    .icon-4 {
      top: 60%;
      right: 10%;
      animation-delay: 1s;
    }

    .icon-5 {
      bottom: 30%;
      right: 25%;
      animation-delay: 3s;
    }

    .icon-6 {
      top: 40%;
      left: 20%;
      animation-delay: 5s;
    }

    @keyframes floatAround {
      0%, 100% {
        transform: translate(0, 0) rotate(0deg);
      }
      25% {
        transform: translate(30px, -30px) rotate(90deg);
      }
      50% {
        transform: translate(-20px, -50px) rotate(180deg);
      }
      75% {
        transform: translate(20px, -30px) rotate(270deg);
      }
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

    .cloud::before,
    .cloud::after {
      content: '';
      position: absolute;
      background: rgba(255, 255, 255, 0.4);
      border-radius: 100px;
    }

    .cloud-1 {
      width: 120px;
      height: 50px;
      top: 15%;
      left: -120px;
      animation-duration: 35s;
    }

    .cloud-1::before {
      width: 60px;
      height: 60px;
      top: -30px;
      left: 15px;
    }

    .cloud-1::after {
      width: 70px;
      height: 45px;
      top: -20px;
      right: 15px;
    }

    .cloud-2 {
      width: 140px;
      height: 55px;
      top: 50%;
      left: -140px;
      animation-duration: 40s;
      animation-delay: 10s;
    }

    .cloud-2::before {
      width: 65px;
      height: 65px;
      top: -32px;
      left: 20px;
    }

    .cloud-2::after {
      width: 75px;
      height: 50px;
      top: -22px;
      right: 20px;
    }

    .cloud-3 {
      width: 100px;
      height: 45px;
      top: 75%;
      left: -100px;
      animation-duration: 45s;
      animation-delay: 20s;
    }

    .cloud-3::before {
      width: 50px;
      height: 50px;
      top: -25px;
      left: 10px;
    }

    .cloud-3::after {
      width: 60px;
      height: 40px;
      top: -15px;
      right: 10px;
    }

    @keyframes cloudDrift {
      0% {
        left: -150px;
      }
      100% {
        left: 110%;
      }
    }

    /* Content Wrapper */
    .content-wrapper {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 30px;
      max-width: 600px;
      width: 100%;
      animation: fadeInUp 0.8s ease-out;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(40px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Mascot Section */
    .mascot-section {
      position: relative;
      cursor: pointer;
      animation: slideDown 0.8s ease-out 0.2s backwards;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-40px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .mascot-box {
      width: 220px;
      height: 220px;
      background: linear-gradient(145deg, #ffffff 0%, #dbeafe 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow:
        0 20px 60px rgba(59, 130, 246, 0.3),
        inset 0 2px 20px rgba(255, 255, 255, 0.8);
      border: 4px solid rgba(255, 255, 255, 0.5);
      position: relative;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      animation: bounce 3s ease-in-out infinite;
    }

    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-15px);
      }
    }

    .mascot-box:hover {
      transform: translateY(-10px) scale(1.05);
      box-shadow:
        0 30px 80px rgba(59, 130, 246, 0.4),
        inset 0 2px 20px rgba(255, 255, 255, 0.9);
    }

    .mascot-img {
      width: 180px;
      height: 180px;
      filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.1));
    }

    .mascot-glow {
      position: absolute;
      inset: -10px;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
      border-radius: 50%;
      animation: glow 2s ease-in-out infinite;
    }

    @keyframes glow {
      0%, 100% {
        opacity: 0.5;
        transform: scale(1);
      }
      50% {
        opacity: 1;
        transform: scale(1.1);
      }
    }

    .emotion-bubble {
      position: absolute;
      top: -70px;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      padding: 15px 25px;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      animation: bubblePop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      z-index: 20;
    }

    @keyframes bubblePop {
      from {
        opacity: 0;
        transform: translateX(-50%) scale(0.5);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) scale(1);
      }
    }

    .emotion-bubble p {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 800;
      color: #1e40af;
      white-space: nowrap;
    }

    .bubble-tail {
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 10px solid white;
    }

    /* Welcome Section */
    .welcome-section {
      text-align: center;
      animation: fadeIn 0.8s ease-out 0.4s backwards;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .main-title {
      font-size: 3.5rem;
      font-weight: 900;
      background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #38bdf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 15px 0;
      animation: titleShine 3s ease-in-out infinite;
    }

    @keyframes titleShine {
      0%, 100% {
        filter: brightness(1);
      }
      50% {
        filter: brightness(1.2);
      }
    }

    .subtitle {
      font-size: 1.4rem;
      font-weight: 700;
      color: #1e40af;
      margin: 0;
    }

    /* Action Buttons */
    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 15px;
      width: 100%;
      max-width: 400px;
      animation: fadeIn 0.8s ease-out 0.6s backwards;
    }

    .start-button {
      position: relative;
      padding: 20px 40px;
      background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #38bdf8 100%);
      border: none;
      border-radius: 25px;
      color: white;
      font-size: 1.5rem;
      font-weight: 900;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      box-shadow:
        0 15px 35px rgba(59, 130, 246, 0.4),
        0 5px 15px rgba(0, 0, 0, 0.2);
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      overflow: hidden;
      animation: buttonPulse 2s ease-in-out infinite;
    }

    @keyframes buttonPulse {
      0%, 100% {
        box-shadow:
          0 15px 35px rgba(59, 130, 246, 0.4),
          0 5px 15px rgba(0, 0, 0, 0.2);
      }
      50% {
        box-shadow:
          0 20px 45px rgba(59, 130, 246, 0.6),
          0 8px 20px rgba(0, 0, 0, 0.3);
      }
    }

    .start-button:hover {
      transform: translateY(-5px) scale(1.05);
      box-shadow:
        0 25px 50px rgba(59, 130, 246, 0.6),
        0 10px 25px rgba(0, 0, 0, 0.3);
    }

    .start-button:active {
      transform: translateY(-2px) scale(1.02);
    }

    .button-icon {
      font-size: 2rem;
      animation: iconFloat 2s ease-in-out infinite;
    }

    @keyframes iconFloat {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-5px);
      }
    }

    .button-arrow {
      font-size: 1.5rem;
      transition: transform 0.3s ease;
    }

    .start-button:hover .button-arrow {
      transform: translateX(5px);
    }

    .button-ripple {
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transform: translateX(-100%);
      transition: transform 0.8s ease;
    }

    .start-button:hover .button-ripple {
      transform: translateX(100%);
    }



    /* Responsive */
    @media (max-width: 768px) {
      .main-title {
        font-size: 2.5rem;
      }

      .subtitle {
        font-size: 1.2rem;
      }

      .mascot-box {
        width: 180px;
        height: 180px;
      }

      .mascot-img {
        width: 150px;
        height: 150px;
      }

      .start-button {
        font-size: 1.3rem;
        padding: 18px 32px;
      }



      .float-icon {
        font-size: 2.5rem;
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
    }, 1000);
  }

  pokeMascot() {
  }

  startLearning() {
    this.router.navigate(['/login']);
  }
}
