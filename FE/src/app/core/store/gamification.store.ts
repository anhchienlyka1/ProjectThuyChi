import { Injectable, signal, computed, PLATFORM_ID, inject, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';

export interface KidProfile {
  name: string;
  avatar: string;
  level: number;
  currentXp: number;
  nextLevelXp: number;
}

@Injectable({
  providedIn: 'root'
})
export class GamificationStore {
  private platformId = inject(PLATFORM_ID);
  private authService = inject(AuthService);

  // State Signals
  readonly stars = signal<number>(0);
  readonly diamonds = signal<number>(0);
  readonly streak = signal<number>(1);

  readonly profile = signal<KidProfile>({
    name: 'Bé Thùy Chi',
    avatar: 'assets/images/avatar-girl.png',
    level: 1,
    currentXp: 0,
    nextLevelXp: 100
  });

  // Computed Selectors
  readonly levelDisplay = computed(() => `Level ${this.profile().level}`);
  readonly progressPercent = computed(() =>
    (this.profile().currentXp / this.profile().nextLevelXp) * 100
  );

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFromStorage();
    }

    // Auto-sync with authenticated user
    effect(() => {
      const user = this.authService.currentUser();
      if (user && user.role === 'student') {
        this.profile.update(current => ({
          ...current,
          name: user.fullName || user.username || 'Bé Yêu',
          avatar: this.getAvatarForGender(user.gender)
        }));
      }
    });
  }

  private getAvatarForGender(gender?: string): string {
    // Use existing avatar.png for female or default
    // User needs to add avatar-boy.png for male
    if (gender === 'male') {
      return '/assets/images/avatar-boy.png';
    }
    return '/assets/images/avatar-girl.png';
  }

  // Actions
  earnStars(amount: number) {
    this.stars.update(v => v + amount);
    this.saveToStorage();
  }

  earnXp(amount: number) {
    this.profile.update(p => {
      let newXp = p.currentXp + amount;
      let newLevel = p.level;
      let newNextXp = p.nextLevelXp;

      if (newXp >= p.nextLevelXp) {
        newXp = newXp - p.nextLevelXp;
        newLevel++;
        newNextXp = Math.floor(newNextXp * 1.5);
        // Play level up sound here via effect or service
        console.log('Level Up!');
      }

      return { ...p, currentXp: newXp, level: newLevel, nextLevelXp: newNextXp };
    });
    this.saveToStorage();
  }

  // Persistence
  private saveToStorage() {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem('kid_stars', this.stars().toString());
    localStorage.setItem('kid_profile', JSON.stringify(this.profile()));
  }

  private loadFromStorage() {
    if (!isPlatformBrowser(this.platformId)) return;
    const s = localStorage.getItem('kid_stars');
    if (s) this.stars.set(parseInt(s, 10));

    const p = localStorage.getItem('kid_profile');
    if (p) this.profile.set(JSON.parse(p));
  }
}
