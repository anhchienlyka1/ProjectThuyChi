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
    <div class="login-container">
      <!-- Background decorations -->
      <div class="bg-decoration circle-1"></div>
      <div class="bg-decoration circle-2"></div>
      <div class="bg-decoration circle-3"></div>

      <!-- Login Card -->
      <div class="login-card">
        <!-- Header with icon based on login type -->
        <div class="login-header">
          <div class="icon-wrapper" [class.student]="loginType === 'student'" [class.parent]="loginType === 'parent'">
            <span class="type-icon">{{ loginType === 'student' ? '👦' : '👨‍👩‍👧' }}</span>
          </div>
          <h1 class="login-title">
            {{ loginType === 'student' ? 'Đăng nhập học sinh' : 'Đăng nhập phụ huynh' }}
          </h1>
          <p class="login-subtitle">
            {{ loginType === 'student' ? 'Chào bé yêu! Hãy nhập thông tin để bắt đầu học nhé!' : 'Chào phụ huynh! Vui lòng đăng nhập để theo dõi con.' }}
          </p>
        </div>

        <!-- Login Form -->
        <form class="login-form" (ngSubmit)="onSubmit()">
          <!-- Username/Email Input - Hidden for Student Mode -->
          <div class="form-group" *ngIf="loginType === 'parent'">
            <label for="username" class="form-label">
              <span class="label-icon">👤</span>
              Email hoặc tên đăng nhập
            </label>
            <input
              type="text"
              id="username"
              [(ngModel)]="credentials.username"
              name="username"
              class="form-input"
              placeholder="Nhập email hoặc tên đăng nhập"
              [required]="loginType === 'parent'"
              autocomplete="username"
            />
          </div>

          <!-- Password/PIN Input -->
          <div class="form-group">
            <label for="password" class="form-label">
              <span class="label-icon">🔒</span>
              Mã PIN
            </label>
            <div class="password-wrapper">
              <input
                [type]="loginType === 'student' || showPassword ? 'text' : 'password'"
                id="password"
                [(ngModel)]="credentials.pinCode"
                name="pinCode"
                class="form-input"
                placeholder="Nhập mã PIN (6 số)"
                required
                maxlength="6"
                autocomplete="current-password"
              />
              <button
                *ngIf="loginType === 'parent'"
                type="button"
                class="toggle-password"
                (click)="showPassword = !showPassword"
                tabindex="-1"
              >
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <div *ngIf="errorMessage" class="error-message">
            <span class="error-icon">⚠️</span>
            {{ errorMessage }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="submit-button"
            [class.student]="loginType === 'student'"
            [class.parent]="loginType === 'parent'"
            [disabled]="isLoading"
          >
            <span *ngIf="!isLoading" class="button-content">
              <span class="button-icon">{{ loginType === 'student' ? '🚀' : '✅' }}</span>
              <span class="button-text">{{ loginType === 'student' ? 'Bắt đầu học' : 'Đăng nhập' }}</span>
            </span>
            <span *ngIf="isLoading" class="loading-spinner">
              <span class="spinner"></span>
              Đang xử lý...
            </span>
          </button>

          <!-- Additional Actions -->
          <div class="form-footer">
            <button
              type="button"
              class="link-button"
              (click)="goBack()"
            >
              ← Quay lại trang chủ
            </button>

            <button
              *ngIf="loginType === 'parent'"
              type="button"
              class="link-button"
              (click)="forgotPassword()"
            >
              Quên mã PIN?
            </button>
          </div>
        </form>

        <!-- Switch Login Type -->
        <div class="switch-type">
          <p>
            {{ loginType === 'student' ? 'Bạn là phụ huynh?' : 'Bạn là học sinh?' }}
            <button
              type="button"
              class="switch-button"
              (click)="switchLoginType()"
            >
              {{ loginType === 'student' ? 'Đăng nhập phụ huynh' : 'Đăng nhập học sinh' }}
            </button>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      position: relative;
      overflow: hidden;
    }

    .bg-decoration {
      position: absolute;
      border-radius: 50%;
      opacity: 0.1;
      animation: float 20s ease-in-out infinite;
    }

    .circle-1 {
      width: 400px;
      height: 400px;
      background: white;
      top: -100px;
      left: -100px;
      animation-delay: 0s;
    }

    .circle-2 {
      width: 300px;
      height: 300px;
      background: white;
      bottom: -50px;
      right: -50px;
      animation-delay: 5s;
    }

    .circle-3 {
      width: 200px;
      height: 200px;
      background: white;
      top: 50%;
      right: 10%;
      animation-delay: 10s;
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(30px, -30px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
    }

    .login-card {
      background: white;
      border-radius: 32px;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.3);
      padding: 48px;
      max-width: 480px;
      width: 100%;
      position: relative;
      z-index: 10;
      animation: slideUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(40px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .login-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .icon-wrapper {
      width: 100px;
      height: 100px;
      margin: 0 auto 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      animation: bounce 2s ease-in-out infinite;
    }

    .icon-wrapper.student {
      background: linear-gradient(135deg, #f97316 0%, #ec4899 100%);
      box-shadow: 0 10px 30px rgba(249, 115, 22, 0.3);
    }

    .icon-wrapper.parent {
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .type-icon {
      font-size: 3.5rem;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
    }

    .login-title {
      font-size: 2rem;
      font-weight: 900;
      color: #1f2937;
      margin: 0 0 12px 0;
    }

    .login-subtitle {
      font-size: 1rem;
      color: #6b7280;
      margin: 0;
      line-height: 1.6;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.95rem;
      font-weight: 700;
      color: #374151;
    }

    .label-icon {
      font-size: 1.2rem;
    }

    .form-input {
      padding: 16px 20px;
      font-size: 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 16px;
      outline: none;
      transition: all 0.3s ease;
      font-family: inherit;
    }

    .form-input:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }

    .password-wrapper {
      position: relative;
    }

    .toggle-password {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 4px;
      opacity: 0.6;
      transition: opacity 0.3s ease;
    }

    .toggle-password:hover {
      opacity: 1;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: #fee2e2;
      border: 2px solid #fca5a5;
      border-radius: 12px;
      color: #dc2626;
      font-size: 0.9rem;
      font-weight: 600;
      animation: shake 0.5s ease;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      75% { transform: translateX(10px); }
    }

    .error-icon {
      font-size: 1.2rem;
    }

    .submit-button {
      padding: 18px 32px;
      font-size: 1.2rem;
      font-weight: 900;
      color: white;
      border: none;
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-top: 8px;
      position: relative;
      overflow: hidden;
    }

    .submit-button.student {
      background: linear-gradient(135deg, #f97316 0%, #ec4899 100%);
      box-shadow: 0 10px 30px rgba(249, 115, 22, 0.3);
    }

    .submit-button.parent {
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
    }

    .submit-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
    }

    .submit-button:active:not(:disabled) {
      transform: translateY(0);
    }

    .submit-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .button-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }

    .button-icon {
      font-size: 1.5rem;
    }

    .loading-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .form-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
      flex-wrap: wrap;
      gap: 12px;
    }

    .link-button {
      background: none;
      border: none;
      color: #667eea;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      padding: 4px 8px;
      transition: all 0.3s ease;
    }

    .link-button:hover {
      color: #764ba2;
      text-decoration: underline;
    }

    .switch-type {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 2px solid #f3f4f6;
      text-align: center;
    }

    .switch-type p {
      margin: 0;
      color: #6b7280;
      font-size: 0.95rem;
    }

    .switch-button {
      background: none;
      border: none;
      color: #667eea;
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
      padding: 0;
      margin-left: 4px;
      transition: all 0.3s ease;
    }

    .switch-button:hover {
      color: #764ba2;
      text-decoration: underline;
    }

    @media (max-width: 640px) {
      .login-card {
        padding: 32px 24px;
      }

      .login-title {
        font-size: 1.5rem;
      }

      .login-subtitle {
        font-size: 0.9rem;
      }

      .icon-wrapper {
        width: 80px;
        height: 80px;
      }

      .type-icon {
        font-size: 2.5rem;
      }

      .form-footer {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  loginType: 'student' | 'parent' = 'student';
  credentials = {
    username: '',
    pinCode: ''
  };
  showPassword = false;
  isLoading = false;
  errorMessage = '';
  returnUrl: string | null = null;

  ngOnInit() {
    // Get login type and returnUrl from query params
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || null;
      if (params['type'] === 'parent') {
        this.loginType = 'parent';
      } else {
        this.loginType = 'student';
      }
    });
  }

  async onSubmit() {
    this.errorMessage = '';
    this.isLoading = true;

    try {
      // Validate inputs
      if (this.loginType === 'parent' && !this.credentials.username) {
        this.errorMessage = 'Vui lòng nhập tên đăng nhập!';
        this.isLoading = false;
        return;
      }

      if (!this.credentials.pinCode) {
        this.errorMessage = 'Vui lòng nhập mã PIN!';
        this.isLoading = false;
        return;
      }


      // Call auth service to login
      const result = await this.authService.login(
        this.credentials.username,
        this.credentials.pinCode,
        this.loginType
      );

      if (result.success) {
        // Redirect to return url if exists
        if (this.returnUrl) {
          this.router.navigateByUrl(this.returnUrl);
          return;
        }

        // Redirect based on login type
        if (this.loginType === 'student') {
          this.router.navigate(['/select-subject']);
        } else {
          this.router.navigate(['/parents']);
        }
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

  switchLoginType() {
    this.loginType = this.loginType === 'student' ? 'parent' : 'student';
    this.credentials = { username: '', pinCode: '' };
    this.errorMessage = '';

    // Update URL query params
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { type: this.loginType },
      queryParamsHandling: 'merge'
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  forgotPassword() {
    // TODO: Implement forgot password functionality
    alert('Chức năng lấy lại mã PIN đang được phát triển!');
  }
}
