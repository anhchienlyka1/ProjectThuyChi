import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type KidTheme = 'morning' | 'afternoon' | 'evening' | 'spring' | 'summer' | 'autumn' | 'winter';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);

  // Current active theme
  currentTheme = signal<KidTheme>('morning');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.detectInitialTheme();
    }
  }

  setTheme(theme: KidTheme) {
    this.currentTheme.set(theme);
    this.applyThemeClasses(theme);
  }

  private detectInitialTheme() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      this.setTheme('morning');
    } else if (hour >= 12 && hour < 18) {
      this.setTheme('afternoon');
    } else {
      this.setTheme('evening');
    }
  }

  private applyThemeClasses(theme: KidTheme) {
    if (!isPlatformBrowser(this.platformId)) return;
    // This connects to Tailwind or global CSS variables
    document.documentElement.setAttribute('data-theme', theme);
  }
}
