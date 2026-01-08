import { Component, effect, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { GamificationStore } from '../../core/store/gamification.store';
import { SessionTimerService } from '../../core/services/session-timer.service';
import { KidAvatarComponent } from '../../shared/ui-kit/kid-avatar/kid-avatar.component';
import { MascotComponent } from '../../shared/ui-kit/mascot/mascot.component';

@Component({
  selector: 'app-child-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, KidAvatarComponent, MascotComponent],
  template: `
    <div class="min-h-screen font-sans relative overflow-auto">
      <app-mascot></app-mascot>

      <!-- Header - Only show on non-home routes -->
      <header class="relative z-20 px-4 py-3 flex justify-between items-center bg-white/30 backdrop-blur-md border-b border-white/20 shadow-sm"
              *ngIf="showHeader">

        <!-- User Profile -->
        <div class="flex items-center gap-3 bg-white/80 p-1.5 pr-4 rounded-full border-2 border-white shadow-sm cursor-pointer hover:scale-105 transition-transform">
          <kid-avatar [size]="48" borderColor="primary" [src]="userProfile().avatar"></kid-avatar>
          <div class="flex flex-col">
            <span class="text-base font-bold text-gray-800 leading-none">{{ userProfile().name }}</span>
            <span class="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Level {{ userProfile().level }}</span>
          </div>
        </div>

        <!-- Gamification & Timer Stats -->
        <div class="flex items-center gap-3">
          <!-- Timer -->
          <div class="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border-2"
               [ngClass]="timerColorClass()">
             <span>⏳</span>
             <span class="font-bold font-mono">{{ formattedTime() }}</span>
          </div>

          <!-- Star Counter -->
          <div class="flex items-center gap-1.5 bg-yellow-400 text-white px-3 py-1.5 rounded-full shadow-md border-2 border-yellow-200"
               (click)="addTestStar()">
             <span class="text-lg">⭐</span>
             <span class="font-black">{{ stars() }}</span>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="relative z-10">
        <router-outlet></router-outlet>
      </main>

    </div>
  `,
  styles: [`
    .animate-float-slow { animation: float 20s infinite ease-in-out; }
    .animate-float-medium { animation: float 15s infinite ease-in-out; }
    .animate-pulse-slow { animation: pulse-glow 4s infinite alternate; }

    @keyframes float {
      0%, 100% { transform: translateY(0px) translateX(0px); }
      50% { transform: translateY(-20px) translateX(10px); }
    }
    @keyframes pulse-glow {
      from { transform: scale(1); opacity: 0.8; }
      to { transform: scale(1.1); opacity: 1; text-shadow: 0 0 20px rgba(255,255,0,0.5); }
    }
    .hidden-scrollbar::-webkit-scrollbar { display: none; }
    .hidden-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class ChildLayoutComponent {
  private themeService = inject(ThemeService);
  private gameStore = inject(GamificationStore);
  private timerService = inject(SessionTimerService);

  currentTheme = this.themeService.currentTheme;

  // Store Signals
  userProfile = this.gameStore.profile;
  stars = this.gameStore.stars;

  // Timer Signals
  remainingSeconds = this.timerService.remainingSeconds;

  formattedTime = computed(() => {
    const mins = Math.floor(this.remainingSeconds() / 60);
    const secs = this.remainingSeconds() % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  });

  timerColorClass = computed(() => {
    const sec = this.remainingSeconds();
    if (sec > 300) return 'border-green-200 text-green-700'; // > 5 mins
    if (sec > 60) return 'border-orange-200 text-orange-700'; // > 1 min
    return 'border-red-400 text-red-600 animate-pulse'; // < 1 min
  });

  constructor() {
    // Debug effect
    effect(() => {
      // can add more debug logs here
    });
  }

  addTestStar() {
    this.gameStore.earnStars(1);
  }

  get showHeader(): boolean {
    // Hide header on home page for cleaner design
    return false; // We'll implement route detection later if needed
  }
}

