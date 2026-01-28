import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FirestoreService } from '../../core/services/firestore.service';
import { where } from 'firebase/firestore';

@Component({
  selector: 'app-register',
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

      <!-- Registration Card -->
      <div class="register-card">
        <!-- Header Section -->
        <div class="header-section">
          <div class="mascot-section">
            <div class="mascot-bounce">
              <span class="mascot-emoji">🦄</span>
            </div>
            <div class="mascot-speech-bubble">
              Tham gia ngay nào! 🚀
            </div>
          </div>
          
          <div class="title-text">
            <h1 class="app-title">Đăng Ký</h1>
          </div>
        </div>

        <!-- Registration Form (2 Columns) -->
        <form class="register-form" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <!-- Left Column: Login Info -->
            <div class="form-column">
              <h3 class="column-title">🔐 Thông tin đăng nhập</h3>
              
              <!-- Full Name -->
              <div class="input-group">
                <div class="input-label">Tên bé</div>
                <input type="text" [(ngModel)]="formData.fullName" name="fullName" class="sky-input" placeholder="Tên đầy đủ" required maxlength="50" />
              </div>

              <!-- Username -->
              <div class="input-group">
                <div class="input-label">Tên đăng nhập</div>
                <input type="text" [(ngModel)]="formData.username" name="username" class="sky-input" placeholder="Viết liền không dấu" required maxlength="20" pattern="[a-zA-Z0-9]+" />
              </div>

              <!-- PIN Code -->
              <div class="input-group">
                <div class="input-label">Mã bí mật (PIN)</div>
                <div class="input-wrapper">
                  <input [type]="showPin ? 'text' : 'password'" [(ngModel)]="formData.pinCode" name="pinCode" class="sky-input pin-input" placeholder="••••••" required minlength="6" maxlength="6" pattern="[0-9]+" />
                  <button type="button" class="eye-button" (click)="showPin = !showPin">{{ showPin ? '🙈' : '👁️' }}</button>
                </div>
              </div>
            </div>

            <!-- Right Column: Personal Info -->
            <div class="form-column">
              <h3 class="column-title">🎨 Cá nhân hóa</h3>
              
              <!-- Gender Selection -->
              <div class="input-group">
                <div class="gender-buttons">
                  <button type="button" class="gender-btn" [class.active]="formData.gender === 'male'" (click)="formData.gender = 'male'; updateDefaultAvatar()">
                    <span class="gender-emoji">👦</span> Bé trai
                  </button>
                  <button type="button" class="gender-btn" [class.active]="formData.gender === 'female'" (click)="formData.gender = 'female'; updateDefaultAvatar()">
                    <span class="gender-emoji">👧</span> Bé gái
                  </button>
                </div>
              </div>

              <!-- Avatar Selection -->
              <div class="input-group">
                <div class="avatar-grid">
                  <button type="button" *ngFor="let avatar of avatars" class="avatar-btn" [class.active]="formData.avatarUrl === avatar.url" (click)="formData.avatarUrl = avatar.url">
                    <span class="avatar-emoji">{{ avatar.emoji }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Error/Success Alerts -->
          <div *ngIf="errorMessage" class="error-alert">
            <span class="alert-emoji">⚠️</span> {{ errorMessage }}
          </div>
          <div *ngIf="successMessage" class="success-alert">
            <span class="alert-emoji">🎉</span> {{ successMessage }}
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button type="button" class="link-btn back-btn" (click)="goBack()">Trở về</button>
            
            <button type="submit" class="start-button" [class.loading]="isLoading" [disabled]="isLoading">
              <span *ngIf="!isLoading" class="button-inner">
                <span class="button-emoji">🚀</span> Tạo tài khoản
              </span>
              <span *ngIf="isLoading" class="loading-state">
                <span class="spinner"></span> Đang tạo...
              </span>
            </button>
            
            <button type="button" class="link-btn login-link" (click)="goToLogin()">Đăng nhập</button>
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
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(180deg, #bae6fd 0%, #7dd3fc 50%, #38bdf8 100%);
      padding: 10px;
      position: relative;
      overflow: hidden;
    }

    /* Background Elements - reused from login */
    .clouds-layer { position: absolute; width: 100%; height: 100%; top: 0; left: 0; pointer-events: none; }
    .cloud { position: absolute; font-size: 5rem; opacity: 0.8; animation: floatCloud linear infinite; filter: drop-shadow(0 10px 15px rgba(255,255,255,0.4)); }
    .cloud-1 { top: 10%; left: -10%; animation-duration: 40s; font-size: 6rem; }
    .cloud-2 { top: 20%; right: -10%; animation-duration: 55s; animation-direction: reverse; }
    .cloud-3 { bottom: 15%; left: -20%; animation-duration: 45s; font-size: 4rem; }
    .cloud-4 { top: 5%; right: 20%; animation-duration: 60s; font-size: 3rem; opacity: 0.6; }
    @keyframes floatCloud { from { transform: translateX(0); } to { transform: translateX(120vw); } }

    .sun { position: absolute; top: -50px; right: -50px; font-size: 10rem; animation: spinSun 60s linear infinite; opacity: 0.9; }
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

    /* Register Card */
    .register-card {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(12px);
      border-radius: 32px;
      padding: 25px 35px;
      width: 100%;
      max-width: 850px;
      max-height: 95vh;
      overflow-y: auto;
      z-index: 10;
      box-shadow: 0 20px 50px rgba(14, 165, 233, 0.2), 0 0 0 6px rgba(255, 255, 255, 0.4);
      display: flex;
      flex-direction: column;
      animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes popIn { from { opacity: 0; transform: scale(0.9) translateY(30px); } to { opacity: 1; transform: scale(1) translateY(0); } }

    /* Header */
    .header-section {
      display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 20px;
      border-bottom: 2px dashed #e2e8f0; padding-bottom: 10px;
    }
    .mascot-section { display: flex; align-items: center; gap: 10px; }
    .mascot-emoji { font-size: 3rem; display: block; filter: drop-shadow(0 5px 10px rgba(0,0,0,0.1)); }
    .mascot-bounce { animation: bounce 2s infinite ease-in-out; }
    @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

    .mascot-speech-bubble {
      background: #e0f2fe; color: #0284c7; padding: 6px 12px; border-radius: 16px; font-size: 0.85rem; font-weight: 700;
      position: relative; white-space: nowrap; box-shadow: 0 2px 4px rgba(14, 165, 233, 0.1);
    }
    
    .app-title {
      font-size: 1.8rem; font-weight: 900; color: #0369a1; margin: 0;
      background: linear-gradient(135deg, #0284c7, #0ea5e9); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }

    /* Form Grid */
    .form-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 20px;
    }
    .column-title {
      font-size: 1.1rem; color: #64748b; margin: 0 0 15px 0; font-weight: 700; border-bottom: 2px solid #f1f5f9; padding-bottom: 5px;
    }

    /* Input Styles */
    .input-group { margin-bottom: 12px; }
    .input-label { margin-bottom: 6px; font-size: 0.9rem; font-weight: 700; color: #475569; }
    
    .sky-input {
      width: 100%; padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 16px; font-size: 1rem; font-weight: 700;
      background: #f8fafc; transition: all 0.2s; color: #0f172a;
    }
    .sky-input:focus {
      border-color: #38bdf8; background: white; outline: none; box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2);
    }
    .pin-input { letter-spacing: 5px; text-align: center; }

    .input-wrapper { position: relative; }
    .eye-button { 
      position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
      background: none; border: none; font-size: 1.2rem; cursor: pointer; opacity: 0.6; transition: opacity 0.2s;
    }
    .eye-button:hover { opacity: 1; }

    /* Gender Buttons */
    .gender-buttons { display: flex; gap: 15px; }
    .gender-btn {
      flex: 1; padding: 12px; border: 2px solid #e2e8f0; border-radius: 16px; background: white;
      cursor: pointer; font-weight: 700; color: #64748b; transition: all 0.2s;
      display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .gender-btn:hover { background: #f0f9ff; border-color: #bae6fd; }
    .gender-btn.active { border-color: #38bdf8; background: #e0f2fe; color: #0284c7; box-shadow: 0 4px 6px rgba(14, 165, 233, 0.1); }
    .gender-emoji { font-size: 1.4rem; }

    /* Avatar Grid */
    .avatar-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
    .avatar-btn {
      aspect-ratio: 1; border: 2px solid #e2e8f0; border-radius: 16px; background: white; cursor: pointer;
      font-size: 1.8rem; display: flex; align-items: center; justify-content: center; transition: all 0.2s;
    }
    .avatar-btn:hover { transform: translateY(-2px); border-color: #bae6fd; }
    .avatar-btn.active { border-color: #38bdf8; background: #e0f2fe; transform: scale(1.1); box-shadow: 0 4px 6px rgba(14, 165, 233, 0.1); }

    /* Action Buttons */
    .action-buttons {
      display: flex; align-items: center; justify-content: space-between; gap: 15px; padding-top: 15px; border-top: 2px solid #f1f5f9;
    }
    
    .start-button {
      flex: 2; padding: 14px 24px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white; border: none; border-radius: 18px; font-weight: 800; font-size: 1.1rem; cursor: pointer;
      box-shadow: 0 8px 16px rgba(245, 158, 11, 0.25); transition: transform 0.2s;
    }
    .start-button:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 12px 20px rgba(245, 158, 11, 0.35); }
    
    .link-btn { background: none; border: none; color: #64748b; font-weight: 700; cursor: pointer; font-size: 0.95rem; transition: color 0.2s; }
    .link-btn:hover { color: #0ea5e9; }
    
    /* Alerts */
    .error-alert, .success-alert {
      padding: 10px; border-radius: 12px; margin-bottom: 15px; font-weight: 700; font-size: 0.9rem; display: flex; gap: 8px; align-items: center;
    }
    .error-alert { background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; }
    .success-alert { background: #dcfce7; color: #16a34a; border: 1px solid #86efac; }
    
    .loading-state { display: flex; align-items: center; justify-content: center; gap: 8px; }
    .spinner { width: 18px; height: 18px; border: 3px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .form-grid { grid-template-columns: 1fr; gap: 20px; }
      .register-card { padding: 20px; max-height: 100vh; border-radius: 0; }
      .header-section { flex-direction: column; gap: 10px; }
      .action-buttons { flex-direction: column-reverse; gap: 12px; }
      .start-button { width: 100%; }
      .link-btn { width: 100%; text-align: center; padding: 10px; border: 1px solid #e2e8f0; border-radius: 12px; }
    }
  `]
})
export class RegisterComponent implements OnInit {
  private router = inject(Router);
  private db = inject(FirestoreService);

  formData = {
    fullName: '',
    username: '',
    pinCode: '',
    gender: 'male' as 'male' | 'female',
    avatarUrl: 'boy1'
  };

  showPin = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Avatar options
  avatars = [
    { emoji: '👦', url: 'boy1' },
    { emoji: '👧', url: 'girl1' },
    { emoji: '🧑', url: 'boy2' },
    { emoji: '👩', url: 'girl2' },
    { emoji: '🦸‍♂️', url: 'superhero' },
    { emoji: '🦸‍♀️', url: 'supergirl' },
    { emoji: '🧙‍♂️', url: 'wizard' },
    { emoji: '🧚‍♀️', url: 'fairy' },
  ];

  // Generate random stars for background
  stars = Array.from({ length: 50 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2
  }));

  ngOnInit() {
    this.updateDefaultAvatar();
  }

  updateDefaultAvatar() {
    // Only update if current avatar is one of the defaults
    if (this.formData.avatarUrl === 'boy1' || this.formData.avatarUrl === 'girl1') {
      this.formData.avatarUrl = this.formData.gender === 'male' ? 'boy1' : 'girl1';
    }
  }

  async onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    // Validation
    if (!this.formData.fullName.trim()) {
      this.errorMessage = 'Vui lòng nhập tên bé!';
      return;
    }

    if (!this.formData.username.trim()) {
      this.errorMessage = 'Vui lòng chọn tên đăng nhập!';
      return;
    }

    if (!/^[a-zA-Z0-9]+$/.test(this.formData.username)) {
      this.errorMessage = 'Tên đăng nhập chỉ được chứa chữ và số!';
      return;
    }

    if (!this.formData.pinCode) {
      this.errorMessage = 'Vui lòng nhập mã PIN!';
      return;
    }

    if (!/^[0-9]{6}$/.test(this.formData.pinCode)) {
      this.errorMessage = 'Mã PIN phải là 6 chữ số!';
      return;
    }

    this.isLoading = true;

    try {
      // Check if username already exists
      const existingUsers = await this.db.queryDocuments(
        'users',
        where('username', '==', this.formData.username.toLowerCase())
      );

      if (existingUsers.length > 0) {
        this.errorMessage = 'Tên đăng nhập đã tồn tại! Vui lòng chọn tên khác.';
        this.isLoading = false;
        return;
      }

      // Check if PIN already exists
      const existingPin = await this.db.queryDocuments(
        'users',
        where('pinCode', '==', this.formData.pinCode)
      );

      if (existingPin.length > 0) {
        this.errorMessage = 'Mã PIN này đã có người sử dụng! Vui lòng chọn mã khác.';
        this.isLoading = false;
        return;
      }

      // Create new user document
      const userId = await this.db.addDocument('users', {
        username: this.formData.username.toLowerCase(),
        fullName: this.formData.fullName.trim(),
        pinCode: this.formData.pinCode,
        role: 'student',
        gender: this.formData.gender,
        avatarUrl: `assets/avatars/${this.formData.avatarUrl}.png`,
        level: 1,
        xp: 0,
        totalStars: 0
      });

      console.log('User created with ID:', userId);

      // Show success message
      this.successMessage = '🎉 Tạo tài khoản thành công! Đang chuyển đến đăng nhập...';

      // Redirect to login after 2 seconds
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);

    } catch (error: any) {
      console.error('Registration error:', error);
      this.errorMessage = 'Có lỗi xảy ra! Vui lòng thử lại sau.';
    } finally {
      this.isLoading = false;
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
