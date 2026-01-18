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
      <div class="fixed inset-0 bg-gradient-to-b from-sky-200 via-sky-300 to-sky-400 -z-10">
        <!-- Animated Blobs -->
        <div class="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
        <div class="absolute top-0 -right-4 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
        <div class="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      <!-- Top Bar with Premium Design -->
      <header class="relative bg-white/70 backdrop-blur-xl shadow-2xl px-6 py-3 border-b-4 border-white/50 z-30">
        <!-- Decorative Background Elements -->
        <div class="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-cyan-400/10 to-indigo-400/10"></div>
        <div class="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-300/20 to-cyan-300/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div class="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-indigo-300/20 to-purple-300/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

        <div class="relative flex justify-between items-center">
          <!-- Left Section: Logo & Title -->
          <div class="flex items-center gap-4">
            <!-- Animated Icon Box -->
            <div class="relative group">
              <div class="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div class="relative bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-2.5 shadow-xl transform group-hover:scale-110 transition-all duration-300">
                <span class="text-3xl">👨‍👩‍👧</span>
              </div>
            </div>

            <!-- Title & Student Info -->
            <div class="flex items-center gap-4">
              <div>
                <div class="flex items-center gap-2 mb-0.5">
                  <h1 class="text-2xl font-black bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent">
                    Góc Phụ Huynh
                  </h1>
                  <div class="px-2 py-0.5 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold rounded-full shadow-md">
                    ONLINE
                  </div>
                </div>
                <div class="text-xs font-semibold text-slate-500">Quản lý học tập của con</div>
              </div>

              <!-- Divider -->
              <div class="w-px h-10 bg-gradient-to-b from-transparent via-slate-300 to-transparent"></div>

              <!-- Enhanced Student Switcher -->
              <div class="flex items-center gap-2">
                <span class="text-sm font-bold text-slate-600">Theo dõi:</span>
                <app-student-switcher></app-student-switcher>
              </div>
            </div>
          </div>

          <!-- Right Section: Back Button -->

          <button routerLink="/"
                  class="group relative overflow-hidden flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white rounded-xl font-black shadow-xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105">
            <!-- Shine Effect -->
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

            <svg class="relative w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            <span class="relative">Màn hình Bé</span>
          </button>
        </div>
      </header>

      <div class="flex flex-1 relative z-10">
        <!-- Sidebar with Glassmorphism -->
        <aside class="w-64 bg-white/40 backdrop-blur-lg border-r-2 border-white/40 hidden md:block shadow-xl">
          <nav class="p-4 space-y-3">
            <a routerLink="/parents"
               routerLinkActive="bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-2xl scale-105"
               [routerLinkActiveOptions]="{exact: true}"
               class="group block px-5 py-4 rounded-2xl text-slate-700 hover:bg-white/70 font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-white/60">
              <div class="flex items-center gap-3">
                <span class="text-2xl transition-transform duration-300 group-hover:scale-110">📊</span>
                <span>Tổng quan</span>
              </div>
            </a>
            <a routerLink="/parents/reports"
               routerLinkActive="bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-2xl scale-105"
               class="group block px-5 py-4 rounded-2xl text-slate-700 hover:bg-white/70 font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-white/60">
              <div class="flex items-center gap-3">
                <span class="text-2xl transition-transform duration-300 group-hover:scale-110">📈</span>
                <span>Báo cáo</span>
              </div>
            </a>
          </nav>
        </aside>

        <!-- Main Content with Semi-transparent Background -->
        <main class="flex-1 overflow-y-auto">
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

    @keyframes bounce-slow {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    .animate-blob {
      animation: blob 7s infinite;
    }

    .animate-bounce-slow {
      animation: bounce-slow 2s ease-in-out infinite;
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
