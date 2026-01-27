import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-container">
      <!-- Animated Space Background -->
      <div class="stars-layer">
        <div class="star" *ngFor="let star of stars" [style.left.%]="star.x" [style.top.%]="star.y" [style.animation-delay.s]="star.delay"></div>
      </div>

      <!-- Floating Planets -->
      <div class="planet planet-1">🪐</div>
      <div class="planet planet-2">🌍</div>
      <div class="planet planet-3">🌙</div>

      <!-- Shooting Stars -->
      <div class="shooting-star"></div>
      <div class="shooting-star" style="animation-delay: 3s;"></div>

      <!-- Login Spaceship Card -->
      <div class="spaceship-card student-mode">
        <!-- Rocket Mascot -->
        <div class="mascot-container">
          <div class="rocket-mascot">
            <div class="rocket-body">🚀</div>
            <div class="rocket-fire">🔥</div>
          </div>
          <div class="mascot-speech-bubble">
            Sẵn sàng khám phá vũ trụ kiến thức chưa? 🌟
          </div>
        </div>

        <!-- Title Section -->
        <div class="title-section">
          <h1 class="space-title">
            <span class="title-emoji">🎮</span>
            Phi Hành Gia Nhí
          </h1>
          <p class="space-subtitle">
            Nhập mã bí mật để bay vào vũ trụ học tập!
          </p>
        </div>

        <!-- Login Form -->
        <form class="space-form" (ngSubmit)="onSubmit()">
          <!-- PIN Input -->
          <div class="input-group">
            <div class="input-label">
              <span class="label-emoji">🔐</span>
              <span class="label-text">Mã bí mật (PIN)</span>
            </div>
            <div class="input-wrapper">
              <input
                type="text"
                [(ngModel)]="credentials.pinCode"
                name="pinCode"
                class="space-input pin-input"
                placeholder="⭐ ⭐ ⭐ ⭐ ⭐ ⭐"
                required
                maxlength="6"
                autocomplete="current-password"
              />
            </div>
          </div>

          <!-- Error Alert -->
          <div *ngIf="errorMessage" class="error-alert">
            <span class="alert-emoji">🛸</span>
            <span class="alert-text">{{ errorMessage }}</span>
          </div>

          <!-- Launch Button -->
          <button
            type="submit"
            class="launch-button"
            [class.launching]="isLoading"
            [disabled]="isLoading"
          >
            <span *ngIf="!isLoading" class="button-inner">
              <span class="button-emoji">🚀</span>
              <span class="button-label">Phóng Tên Lửa!</span>
            </span>
            <span *ngIf="isLoading" class="loading-state">
              <span class="orbit-spinner"></span>
              <span>Đang khởi động...</span>
            </span>
          </button>

          <!-- Footer Links -->
          <div class="footer-links">
            <button type="button" class="link-btn" (click)="goBack()">
              ← Quay về trái đất
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

    * {
      font-family: 'Nunito', sans-serif;
    }

    .space-container {
      min-height: 100vh;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #334155 100%);
      padding: 15px;
      position: relative;
      overflow: hidden;
    }

    /* Animated Stars */
    .stars-layer {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 1;
    }

    .star {
      position: absolute;
      width: 3px;
      height: 3px;
      background: white;
      border-radius: 50%;
      animation: twinkle 2s ease-in-out infinite;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
    }

    @keyframes twinkle {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.5); }
    }

    /* Floating Planets */
    .planet {
      position: absolute;
      font-size: 4rem;
      animation: orbit 30s linear infinite;
      z-index: 2;
      filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
    }

    .planet-1 {
      top: 10%;
      left: 15%;
      animation-duration: 25s;
    }

    .planet-2 {
      bottom: 15%;
      right: 10%;
      animation-duration: 35s;
      animation-direction: reverse;
    }

    .planet-3 {
      top: 60%;
      left: 5%;
      font-size: 3rem;
      animation-duration: 20s;
    }

    @keyframes orbit {
      0% { transform: translate(0, 0) rotate(0deg); }
      25% { transform: translate(30px, -30px) rotate(90deg); }
      50% { transform: translate(0, -60px) rotate(180deg); }
      75% { transform: translate(-30px, -30px) rotate(270deg); }
      100% { transform: translate(0, 0) rotate(360deg); }
    }

    /* Shooting Stars */
    .shooting-star {
      position: absolute;
      top: 20%;
      right: -100px;
      width: 2px;
      height: 2px;
      background: white;
      box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.8);
      animation: shoot 5s linear infinite;
      z-index: 2;
    }

    @keyframes shoot {
      0% {
        transform: translateX(0) translateY(0);
        opacity: 1;
      }
      70% {
        opacity: 1;
      }
      100% {
        transform: translateX(-1000px) translateY(500px);
        opacity: 0;
      }
    }

    /* Spaceship Card */
    .spaceship-card {
      background: linear-gradient(145deg, #ffffff 0%, #f0f9ff 100%);
      border-radius: 32px;
      box-shadow:
        0 50px 100px rgba(0, 0, 0, 0.5),
        0 0 80px rgba(59, 130, 246, 0.3),
        inset 0 2px 20px rgba(255, 255, 255, 0.8);
      padding: 30px 35px;
      max-width: 480px;
      max-height: 95vh;
      overflow-y: auto;
      width: 100%;
      position: relative;
      z-index: 10;
      animation: floatIn 1s cubic-bezier(0.34, 1.56, 0.64, 1);
      border: 3px solid rgba(255, 255, 255, 0.3);
    }

    .spaceship-card.student-mode {
      box-shadow:
        0 50px 100px rgba(0, 0, 0, 0.5),
        0 0 80px rgba(249, 115, 22, 0.4),
        inset 0 2px 20px rgba(255, 255, 255, 0.8);
    }

    @keyframes floatIn {
      0% {
        opacity: 0;
        transform: translateY(100px) scale(0.8);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    /* Rocket Mascot */
    .mascot-container {
      text-align: center;
      margin-bottom: 20px;
      position: relative;
    }

    .rocket-mascot {
      display: inline-block;
      position: relative;
      animation: rocketHover 3s ease-in-out infinite;
    }

    .rocket-body {
      font-size: 3.5rem;
      filter: drop-shadow(0 10px 30px rgba(249, 115, 22, 0.4));
      animation: rocketRotate 4s ease-in-out infinite;
    }

    .rocket-fire {
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 1.5rem;
      animation: fireFlicker 0.3s ease-in-out infinite;
    }

    @keyframes rocketHover {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }

    @keyframes rocketRotate {
      0%, 100% { transform: rotate(-5deg); }
      50% { transform: rotate(5deg); }
    }

    @keyframes fireFlicker {
      0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
      50% { opacity: 0.7; transform: translateX(-50%) scale(1.2); }
    }

    .mascot-speech-bubble {
      margin-top: 12px;
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      padding: 10px 16px;
      border-radius: 16px;
      font-size: 0.9rem;
      font-weight: 700;
      color: #92400e;
      position: relative;
      box-shadow: 0 5px 15px rgba(251, 191, 36, 0.3);
      animation: bubblePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s backwards;
    }

    .mascot-speech-bubble::before {
      content: '';
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 10px solid #fef3c7;
    }

    @keyframes bubblePop {
      0% {
        opacity: 0;
        transform: scale(0);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }

    /* Title Section */
    .title-section {
      text-align: center;
      margin-bottom: 20px;
    }

    .space-title {
      font-size: 1.8rem;
      font-weight: 900;
      background: linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fbbf24 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 12px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      animation: titleShine 3s ease-in-out infinite;
    }



    @keyframes titleShine {
      0%, 100% { filter: brightness(1); }
      50% { filter: brightness(1.2); }
    }

    .title-emoji {
      font-size: 2rem;
      animation: emojiSpin 2s ease-in-out infinite;
    }

    @keyframes emojiSpin {
      0%, 100% { transform: rotate(0deg) scale(1); }
      25% { transform: rotate(-10deg) scale(1.1); }
      75% { transform: rotate(10deg) scale(1.1); }
    }

    .space-subtitle {
      font-size: 0.95rem;
      color: #475569;
      font-weight: 600;
      margin: 0;
      line-height: 1.6;
    }

    /* Form Styling */
    .space-form {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .input-group {
      animation: slideInLeft 0.6s ease-out backwards;
    }

    .input-group:nth-child(2) {
      animation-delay: 0.1s;
    }

    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .input-label {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .label-emoji {
      font-size: 1.3rem;
    }

    .label-text {
      font-size: 0.95rem;
      font-weight: 800;
      color: #1e293b;
    }

    .input-wrapper {
      position: relative;
    }

    .space-input {
      width: 100%;
      padding: 14px 18px;
      font-size: 1rem;
      font-weight: 600;
      border: 3px solid #cbd5e1;
      border-radius: 20px;
      outline: none;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      background: white;
      color: #1e293b;
      box-sizing: border-box;
    }

    .space-input:focus {
      border-color: #f97316;
      box-shadow: 0 0 0 6px rgba(249, 115, 22, 0.15);
      transform: scale(1.02);
    }



    .space-input::placeholder {
      color: #94a3b8;
      font-weight: 600;
    }

    .pin-input {
      letter-spacing: 6px;
      text-align: center;
      font-size: 1.1rem;
    }

    .eye-button {
      position: absolute;
      right: 18px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      font-size: 1.8rem;
      cursor: pointer;
      padding: 5px;
      transition: all 0.3s ease;
    }

    .eye-button:hover {
      transform: translateY(-50%) scale(1.2);
    }

    /* Error Alert */
    .error-alert {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
      border: 3px solid #f87171;
      border-radius: 20px;
      animation: alertShake 0.6s ease;
    }

    @keyframes alertShake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-15px); }
      75% { transform: translateX(15px); }
    }

    .alert-emoji {
      font-size: 1.8rem;
      animation: alertSpin 0.5s ease;
    }

    @keyframes alertSpin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .alert-text {
      font-size: 1rem;
      font-weight: 700;
      color: #dc2626;
    }

    /* Launch Button */
    .launch-button {
      padding: 16px 32px;
      font-size: 1.2rem;
      font-weight: 900;
      color: white;
      background: linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fbbf24 100%);
      border: none;
      border-radius: 25px;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow:
        0 15px 35px rgba(249, 115, 22, 0.4),
        0 5px 15px rgba(0, 0, 0, 0.2);
      position: relative;
      overflow: hidden;
      animation: buttonPulse 2s ease-in-out infinite;
    }



    @keyframes buttonPulse {
      0%, 100% { box-shadow: 0 15px 35px rgba(249, 115, 22, 0.4), 0 5px 15px rgba(0, 0, 0, 0.2); }
      50% { box-shadow: 0 20px 45px rgba(249, 115, 22, 0.6), 0 8px 20px rgba(0, 0, 0, 0.3); }
    }

    .launch-button:hover:not(:disabled) {
      transform: translateY(-5px) scale(1.05);
      box-shadow:
        0 25px 50px rgba(249, 115, 22, 0.6),
        0 10px 25px rgba(0, 0, 0, 0.3);
    }

    .launch-button:active:not(:disabled) {
      transform: translateY(-2px) scale(1.02);
    }

    .launch-button:disabled {
      opacity: 0.8;
      cursor: not-allowed;
    }

    .launch-button.launching {
      animation: launching 1s ease-in-out infinite;
    }

    @keyframes launching {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .button-inner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 15px;
    }

    .button-emoji {
      font-size: 1.5rem;
      animation: buttonEmojiFloat 1.5s ease-in-out infinite;
    }

    @keyframes buttonEmojiFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }

    .loading-state {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 15px;
    }

    .orbit-spinner {
      width: 24px;
      height: 24px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: orbitSpin 1s linear infinite;
    }

    @keyframes orbitSpin {
      to { transform: rotate(360deg); }
    }

    /* Footer Links */
    .footer-links {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 15px;
      flex-wrap: wrap;
      margin-top: 10px;
    }

    .link-btn {
      background: none;
      border: none;
      color: #64748b;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      padding: 8px 12px;
      transition: all 0.3s ease;
      border-radius: 12px;
    }

    .link-btn:hover {
      color: #f97316;
      background: rgba(249, 115, 22, 0.1);
      transform: translateX(-3px);
    }


    .mode-switcher {
      margin-top: 20px;
      text-align: center;
    }

    .switcher-divider {
      height: 2px;
      background: linear-gradient(90deg, transparent 0%, #e2e8f0 50%, transparent 100%);
      margin-bottom: 20px;
    }

    .switcher-text {
      margin: 0 0 10px 0;
      color: #64748b;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .switch-mode-btn {
      background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
      border: 2px solid #cbd5e1;
      color: #1e293b;
      font-size: 0.95rem;
      font-weight: 800;
      padding: 10px 20px;
      border-radius: 18px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }

    .switch-mode-btn:hover {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border-color: #fbbf24;
      color: #92400e;
      transform: scale(1.05);
      box-shadow: 0 10px 25px rgba(251, 191, 36, 0.3);
    }

    .switch-emoji {
      font-size: 1.3rem;
    }

    /* Responsive Design */
    @media (max-width: 640px) {
      .spaceship-card {
        padding: 35px 25px;
        border-radius: 30px;
      }

      .rocket-body {
        font-size: 4rem;
      }

      .space-title {
        font-size: 1.7rem;
      }

      .title-emoji {
        font-size: 2rem;
      }

      .space-subtitle {
        font-size: 0.95rem;
      }

      .mascot-speech-bubble {
        font-size: 0.9rem;
        padding: 12px 16px;
      }

      .space-input {
        padding: 16px 18px;
        font-size: 1rem;
      }

      .launch-button {
        padding: 18px 32px;
        font-size: 1.2rem;
      }

      .footer-links {
        flex-direction: column;
        align-items: stretch;
      }

      .link-btn {
        text-align: center;
      }

      .planet {
        font-size: 3rem;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  credentials = {
    pinCode: ''
  };
  isLoading = false;
  errorMessage = '';
  returnUrl: string | null = null;

  // Generate random stars for background
  stars = Array.from({ length: 50 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2
  }));

  ngOnInit() {
    // Get returnUrl from query params
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || null;
    });
  }

  async onSubmit() {
    this.errorMessage = '';
    this.isLoading = true;

    try {
      // Validate inputs
      if (!this.credentials.pinCode) {
        this.errorMessage = 'Vui lòng nhập mã PIN!';
        this.isLoading = false;
        return;
      }

      // Call auth service to login (student only)
      const result = await this.authService.login(
        '',
        this.credentials.pinCode,
        'student'
      );

      if (result.success) {
        // Redirect to return url if exists
        if (this.returnUrl) {
          this.router.navigateByUrl(this.returnUrl);
          return;
        }

        // Redirect to subject selection
        this.router.navigate(['/select-subject']);
      } else {
        this.errorMessage = result.message || 'Đăng nhập thất bại. Vui lòng thử lại!';
      }
    } catch (error: any) {
      console.error('Login error:', error);
      this.errorMessage = error.message || 'Có lỗi xảy ra. Vui lòng thử lại sau!';
    } finally {
      this.isLoading = false;
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
