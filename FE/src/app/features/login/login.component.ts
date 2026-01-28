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
    <div class="sky-container">
      <!-- Animated Clouds Background -->
      <div class="clouds-layer">
        <div class="cloud cloud-1">☁️</div>
        <div class="cloud cloud-2">☁️</div>
        <div class="cloud cloud-3">☁️</div>
        <div class="cloud cloud-4">☁️</div>
      </div>

      <!-- Sun & Birds -->
      <div class="sun">☀️</div>
      <div class="bird bird-1">🕊️</div>
      <div class="bird bird-2">🕊️</div>

      <!-- Login Card -->
      <div class="login-card">
        <!-- Mascot -->
        <div class="mascot-container">
          <div class="mascot-bounce">
            <span class="mascot-emoji">🦄</span> <!-- Unicorn Mascot -->
          </div>
          <div class="mascot-speech-bubble">
            Sẵn sàng khám phá chưa? ✨
          </div>
        </div>

        <!-- Title Section -->
        <div class="title-section">
          <h1 class="app-title">
            <span class="title-emoji">🌈</span>
            Phi Hành Gia Nhí
          </h1>
          <p class="app-subtitle">
            Nhập mã bí mật để bắt đầu hành trình!
          </p>
        </div>

        <!-- Login Form -->
        <form class="login-form" (ngSubmit)="onSubmit()">
          <!-- PIN Input -->
          <div class="input-group">
            <div class="input-label">
              <span class="label-text">🔑 Mã bí mật (PIN)</span>
            </div>
            <div class="input-wrapper">
              <input
                type="text"
                [(ngModel)]="credentials.pinCode"
                name="pinCode"
                class="sky-input pin-input"
                placeholder="• • • • • •"
                required
                maxlength="6"
                autocomplete="current-password"
              />
            </div>
          </div>

          <!-- Error Alert -->
          <div *ngIf="errorMessage" class="error-alert">
            <span class="alert-emoji">🐣</span>
            <span class="alert-text">{{ errorMessage }}</span>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            class="start-button"
            [class.loading]="isLoading"
            [disabled]="isLoading"
          >
            <span *ngIf="!isLoading" class="button-inner">
              <span class="button-emoji">🚀</span>
              <span class="button-label">Vào Lớp Học!</span>
            </span>
            <span *ngIf="isLoading" class="loading-state">
              <span class="spinner"></span>
              <span>Đang vào...</span>
            </span>
          </button>

          <!-- Footer Links -->
          <div class="footer-links">
            <button type="button" class="link-btn" (click)="goToRegister()">
              ✨ Chưa có tài khoản?
            </button>
            <button type="button" class="link-btn secondary" (click)="goBack()">
              🏠 Về trang chủ
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

    * { font-family: 'Nunito', sans-serif; box-sizing: border-box; }

    .sky-container {
      min-height: 100vh;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(180deg, #bae6fd 0%, #7dd3fc 50%, #38bdf8 100%); /* Sky Blue Gradient */
      padding: 15px;
      position: relative;
      overflow: hidden;
    }

    /* Background Elements */
    .clouds-layer { position: absolute; width: 100%; height: 100%; top: 0; left: 0; pointer-events: none; }
    
    .cloud {
      position: absolute; font-size: 5rem; opacity: 0.8;
      animation: floatCloud linear infinite; filter: drop-shadow(0 10px 15px rgba(255,255,255,0.4));
    }
    .cloud-1 { top: 10%; left: -10%; animation-duration: 40s; font-size: 6rem; }
    .cloud-2 { top: 20%; right: -10%; animation-duration: 55s; animation-direction: reverse; }
    .cloud-3 { bottom: 15%; left: -20%; animation-duration: 45s; font-size: 4rem; }
    .cloud-4 { top: 5%; right: 20%; animation-duration: 60s; font-size: 3rem; opacity: 0.6; }

    @keyframes floatCloud {
      from { transform: translateX(0); }
      to { transform: translateX(120vw); }
    }

    .sun {
      position: absolute; top: -50px; right: -50px; font-size: 10rem;
      animation: spinSun 60s linear infinite; opacity: 0.9;
    }
    @keyframes spinSun { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

    .bird { position: absolute; font-size: 2rem; animation: flyBird 20s linear infinite; }
    .bird-1 { top: 15%; left: -50px; animation-delay: 5s; }
    .bird-2 { top: 30%; left: -50px; animation-delay: 15s; font-size: 1.5rem; }

    @keyframes flyBird {
      0% { transform: translate(0, 0); }
      25% { transform: translate(30vw, -50px); }
      50% { transform: translate(60vw, 0); }
      75% { transform: translate(90vw, -80px); }
      100% { transform: translate(120vw, 20px); }
    }

    /* Login Card */
    .login-card {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(12px);
      border-radius: 32px;
      padding: 30px 40px;
      width: 100%;
      max-width: 450px;
      box-shadow: 
        0 20px 40px rgba(14, 165, 233, 0.2),
        0 0 0 6px rgba(255, 255, 255, 0.4);
      text-align: center;
      position: relative;
      z-index: 10;
      animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes popIn {
      from { opacity: 0; transform: scale(0.8) translateY(50px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    /* Mascot */
    .mascot-container { margin-bottom: 10px; position: relative; }
    .mascot-emoji { font-size: 4.5rem; display: block; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1)); }
    .mascot-bounce { animation: bounce 2s infinite ease-in-out; }
    @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }

    .mascot-speech-bubble {
      display: inline-block; background: #e0f2fe; color: #0284c7; padding: 8px 16px; border-radius: 20px;
      font-weight: 700; font-size: 0.9rem; margin-top: 5px; position: relative;
      box-shadow: 0 4px 6px rgba(14, 165, 233, 0.1);
    }
    .mascot-speech-bubble::before {
      content: ''; position: absolute; top: -6px; left: 50%; transform: translateX(-50%);
      border-left: 6px solid transparent; border-right: 6px solid transparent; border-bottom: 6px solid #e0f2fe;
    }

    /* Title */
    .app-title {
      font-size: 2rem; font-weight: 900; color: #0369a1; margin: 10px 0 5px;
      display: flex; align-items: center; justify-content: center; gap: 10px;
    }
    .app-subtitle { color: #64748b; margin: 0 0 20px 0; font-weight: 600; font-size: 0.95rem; }

    /* Form */
    .login-form { display: flex; flex-direction: column; gap: 15px; }
    
    .input-label { text-align: left; margin-bottom: 5px; }
    .label-text { font-weight: 800; color: #334155; font-size: 0.95rem; }
    
    .sky-input {
      width: 100%; padding: 15px; border: 3px solid #e2e8f0; border-radius: 18px;
      font-size: 1.2rem; font-weight: 800; color: #0f172a; text-align: center;
      transition: all 0.2s; background: #f8fafc;
    }
    .sky-input:focus {
      border-color: #38bdf8; background: white; outline: none;
      box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.2); transform: scale(1.02);
    }
    .pin-input { letter-spacing: 8px; }

    /* Button */
    .start-button {
      padding: 16px; border: none; border-radius: 20px;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); /* Amber/Orange */
      color: white; font-size: 1.2rem; font-weight: 900; cursor: pointer;
      box-shadow: 0 10px 20px rgba(245, 158, 11, 0.3); transition: all 0.2s;
      position: relative; overflow: hidden; margin-top: 10px;
    }
    .start-button:hover:not(:disabled) {
      transform: translateY(-4px); box-shadow: 0 15px 30px rgba(245, 158, 11, 0.4);
    }
    .start-button:active:not(:disabled) { transform: translateY(-2px); }
    
    .button-inner { display: flex; align-items: center; justify-content: center; gap: 10px; }
    
    /* Loading */
    .loading-state { display: flex; align-items: center; justify-content: center; gap: 10px; font-style: italic; }
    .spinner {
      width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3); border-top-color: white;
      border-radius: 50%; animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Error */
    .error-alert {
      background: #fee2e2; color: #dc2626; padding: 10px; border-radius: 12px;
      font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px;
      border: 2px solid #fecaca; animation: shake 0.5s ease;
    }
    @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }

    /* Footer */
    .footer-links { margin-top: 15px; display: flex; flex-direction: column; gap: 10px; }
    .link-btn {
      background: none; border: none; font-weight: 700; font-size: 0.95rem; cursor: pointer;
      color: #0369a1; transition: color 0.2s;
    }
    .link-btn:hover { color: #0ea5e9; text-decoration: underline; }
    .secondary { color: #64748b; font-size: 0.9rem; }
    .secondary:hover { color: #475569; }

    @media (max-width: 640px) {
      .login-card { padding: 25px; max-width: 90%; }
      .app-title { font-size: 1.6rem; }
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

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
