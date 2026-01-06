import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

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

    // State Signals
    readonly stars = signal<number>(0);
    readonly diamonds = signal<number>(0);
    readonly streak = signal<number>(1);

    readonly profile = signal<KidProfile>({
        name: 'Bé Bi',
        avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix',
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
