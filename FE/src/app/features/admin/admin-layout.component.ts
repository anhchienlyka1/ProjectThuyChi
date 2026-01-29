import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { IconsModule } from '../../shared/ui-kit/icons/icons.module';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, IconsModule],
  template: `
    <div class="admin-wrapper">
      <!-- Sky Background with Clouds (matching home) -->
      <div class="sky-background"></div>
      
      <!-- Clouds -->
      <div class="clouds">
        <div class="cloud cloud-1"></div>
        <div class="cloud cloud-2"></div>
        <div class="cloud cloud-3"></div>
      </div>

      <!-- Floating Elements -->
      <div class="floating-elements">
        <span class="float-icon icon-1">📚</span>
        <span class="float-icon icon-2">✏️</span>
        <span class="float-icon icon-3">🎯</span>
        <span class="float-icon icon-4">⭐</span>
      </div>

      <div class="content-container">
        <!-- Sidebar -->
        <aside class="sidebar">
          <!-- Logo/Brand -->
          <div class="sidebar-header">
            <h1 class="sidebar-title">
              👨‍💼 Admin Panel
            </h1>
            <p class="sidebar-subtitle">Quản lý bài tập</p>
          </div>

          <!-- Navigation -->
          <nav class="sidebar-nav">
            <a
              *ngFor="let item of navItems"
              [routerLink]="item.route"
              routerLinkActive="nav-active"
              class="nav-item"
            >
              <lucide-icon 
                [name]="item.icon" 
                [size]="20"
              ></lucide-icon>
              <span class="nav-label">{{ item.label }}</span>
            </a>
          </nav>

          <!-- Bottom Actions -->
          <div class="sidebar-footer">
            <button (click)="goToApp()" class="footer-button">
              <lucide-icon name="Home" [size]="20"></lucide-icon>
              <span>Về App</span>
            </button>
            <button class="footer-button">
              <lucide-icon name="LogOut" [size]="20"></lucide-icon>
              <span>Đăng xuất</span>
            </button>
          </div>
        </aside>

        <!-- Main Content -->
        <div class="main-content">
          <!-- Top Header -->
          <header class="header">
            <div class="header-content">
              <div>
                <h2 class="page-title">{{ currentPageTitle }}</h2>
                <p class="page-subtitle">Quản lý và tạo bài tập cho bé</p>
              </div>
              <div class="user-info">
                <div class="user-avatar">A</div>
                <div>
                  <p class="user-name">Admin</p>
                  <p class="user-role">Quản trị viên</p>
                </div>
              </div>
            </div>
          </header>

          <!-- Page Content -->
          <main class="page-content">
            <router-outlet></router-outlet>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }

    .admin-wrapper {
      min-height: 100vh;
      position: relative;
      overflow: hidden;
    }

    /* Sky Background - matching home */
    .sky-background {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, #bae6fd 0%, #7dd3fc 50%, #38bdf8 100%);
      z-index: 0;
    }

    /* Clouds - matching home */
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
      0% { left: -150px; }
      100% { left: 110%; }
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
      font-size: 2rem;
      opacity: 0.15;
      animation: floatAround 20s ease-in-out infinite;
    }

    .icon-1 { top: 15%; left: 10%; animation-delay: 0s; }
    .icon-2 { top: 25%; right: 15%; animation-delay: 2s; }
    .icon-3 { bottom: 25%; left: 15%; animation-delay: 4s; }
    .icon-4 { top: 55%; right: 20%; animation-delay: 1s; }

    @keyframes floatAround {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      25% { transform: translate(30px, -30px) rotate(90deg); }
      50% { transform: translate(-20px, -50px) rotate(180deg); }
      75% { transform: translate(20px, -30px) rotate(270deg); }
    }

    /* Content Container */
    .content-container {
      position: relative;
      z-index: 10;
      display: flex;
      min-height: 100vh;
    }

    /* Sidebar với glassmorphism */
    .sidebar {
      width: 16rem;
      background: rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-right: 1px solid rgba(255, 255, 255, 0.3);
      display: flex;
      flex-direction: column;
      box-shadow: 4px 0 24px rgba(0, 0, 0, 0.1);
    }

    .sidebar-header {
      padding: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }

    .sidebar-title {
      font-size: 1.5rem;
      font-weight: 900;
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .sidebar-subtitle {
      color: #1e40af;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      font-weight: 600;
    }

    .sidebar-nav {
      flex: 1;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: 0.75rem;
      transition: all 0.3s;
      cursor: pointer;
      color: #1e40af;
      font-weight: 600;
      text-decoration: none;
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.4);
      transform: translateX(4px);
    }

    .nav-active {
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%) !important;
      color: white !important;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

    .nav-label {
      font-weight: 600;
    }

    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .footer-button {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: 0.75rem;
      background: transparent;
      border: none;
      color: #1e40af;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .footer-button:hover {
      background: rgba(255, 255, 255, 0.4);
    }

    /* Main Content */
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
      padding: 1.5rem 2rem;
      border-bottom: 1px solid rgba(59, 130, 246, 0.1);
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .page-title {
      font-size: 1.75rem;
      font-weight: 900;
      color: #1e293b;
    }

    .page-subtitle {
      font-size: 0.875rem;
      color: #64748b;
      margin-top: 0.25rem;
      font-weight: 500;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      border: 1px solid rgba(147, 51, 234, 0.2);
    }

    .user-avatar {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 9999px;
      background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 1.125rem;
    }

    .user-name {
      font-weight: 700;
      font-size: 0.875rem;
      color: #1e293b;
    }

    .user-role {
      font-size: 0.75rem;
      color: #64748b;
    }

    .page-content {
      flex: 1;
      overflow: auto;
      padding: 2rem;
    }
  `]
})
export class AdminLayoutComponent {
  navItems: NavItem[] = [
    { label: 'Bài tập Tiếng Việt', icon: 'BookOpen', route: '/admin/exercises' }
  ];

  currentPageTitle = 'Bài tập Tiếng Việt';

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      const url = this.router.url;
      if (url.includes('new')) {
        this.currentPageTitle = 'Tạo bài tập Tiếng Việt mới';
      } else if (url.includes('edit')) {
        this.currentPageTitle = 'Chỉnh sửa bài tập Tiếng Việt';
      } else {
        this.currentPageTitle = 'Bài tập Tiếng Việt';
      }
    });
  }

  goToApp(): void {
    this.router.navigate(['/']);
  }
}
