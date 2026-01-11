import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { StudentSwitcherComponent } from '../../shared/components/student-switcher.component';
import { StudentSwitcherService } from '../../core/services/student-switcher.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-parent-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, StudentSwitcherComponent],
  template: `
    <div class="min-h-screen flex flex-col font-sans relative overflow-hidden">

      <!-- Animated Background -->
      <div class="fixed inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 -z-10">
        <!-- Animated Blobs -->
        <div class="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div class="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div class="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <!-- Top Bar with Glassmorphism -->
      <header class="bg-white/90 backdrop-blur-md shadow-lg px-6 py-4 flex justify-between items-center border-b border-white/20 relative z-30">
        <div class="flex items-center gap-3">
           <div class="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-2 shadow-lg">
             <span class="text-2xl">👨‍👩‍👧</span>
           </div>
            <div>
              <h1 class="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Góc Phụ Huynh</h1>
              <div class="mt-1">
                <app-student-switcher></app-student-switcher>
              </div>
            </div>
        </div>

        <!-- Beautiful Back Button -->
        <button routerLink="/"
                class="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-pink-700">
          <svg class="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          <span>Màn hình Bé</span>
        </button>
      </header>

      <div class="flex flex-1 relative z-10">
        <!-- Sidebar with Glassmorphism -->
        <aside class="w-64 bg-white/80 backdrop-blur-md border-r border-white/20 hidden md:block shadow-xl">
          <nav class="p-4 space-y-2">
            <a routerLink="/parents"
               routerLinkActive="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl scale-105"
               [routerLinkActiveOptions]="{exact: true}"
               class="group block px-4 py-3 rounded-xl text-gray-700 hover:bg-white/60 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div class="flex items-center gap-3">
                <span class="text-2xl transition-transform duration-300 group-hover:scale-110">📊</span>
                <span>Tổng quan</span>
              </div>
            </a>
            <a routerLink="/parents/history"
               routerLinkActive="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl scale-105"
               class="group block px-4 py-3 rounded-xl text-gray-700 hover:bg-white/60 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div class="flex items-center gap-3">
                <span class="text-2xl transition-transform duration-300 group-hover:scale-110">📚</span>
                <span>Lịch sử học tập</span>
              </div>
            </a>
            <a routerLink="/parents/settings"
               routerLinkActive="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl scale-105"
               class="group block px-4 py-3 rounded-xl text-gray-700 hover:bg-white/60 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div class="flex items-center gap-3">
                <span class="text-2xl transition-transform duration-300 group-hover:scale-110">⚙️</span>
                <span>Cài đặt</span>
              </div>
            </a>
            <a routerLink="/parents/reports"
               routerLinkActive="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl scale-105"
               class="group block px-4 py-3 rounded-xl text-gray-700 hover:bg-white/60 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div class="flex items-center gap-3">
                <span class="text-2xl transition-transform duration-300 group-hover:scale-110">📈</span>
                <span>Báo cáo</span>
              </div>
            </a>
          </nav>
        </aside>

        <!-- Main Content with Semi-transparent Background -->
        <main class="flex-1 p-6 md:p-8 overflow-y-auto">
          <router-outlet></router-outlet>
        </main>
      </div>

    </div>
  `,
  styles: [`
    @keyframes blob {
      0%, 100% {
        transform: translate(0px, 0px) scale(1);
      }
      33% {
        transform: translate(30px, -50px) scale(1.1);
      }
      66% {
        transform: translate(-20px, 20px) scale(0.9);
      }
    }

    .animate-blob {
      animation: blob 7s infinite;
    }

    .animation-delay-2000 {
      animation-delay: 2s;
    }

    .animation-delay-4000 {
      animation-delay: 4s;
    }
  `]
})
export class ParentLayoutComponent implements OnInit {
  constructor(
    private studentSwitcherService: StudentSwitcherService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    let parentId = this.authService.getUserId();

    // Fallback to localStorage
    if (!parentId) {
      try {
        const userStr = localStorage.getItem('thuyChi_user');
        if (userStr) {
          const user = JSON.parse(userStr);
          parentId = user.id;
        }
      } catch (e) { }
    }

    if (parentId) {
      this.studentSwitcherService.loadStudents(parentId);
    }
  }
}
