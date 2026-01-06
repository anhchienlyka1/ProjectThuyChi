import { Injectable, inject, signal } from '@angular/core';
import { GamificationStore } from '../store/gamification.store';
import { MascotService } from './mascot.service';

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    condition: (stats: any) => boolean;
    unlocked: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AchievementService {
    private gameStore = inject(GamificationStore);
    private mascot = inject(MascotService);

    readonly badges = signal<Badge[]>([
        {
            id: 'first_star',
            name: 'Ngôi sao đầu tiên',
            description: 'Kiếm được 10 ngôi sao',
            icon: '🌟',
            condition: (stats) => stats.stars >= 10,
            unlocked: false
        },
        {
            id: 'math_master',
            name: 'Thần đồng Toán học',
            description: 'Hoàn thành 5 bài toán',
            icon: '🧮',
            condition: (stats) => stats.mathCompleted >= 5, // Mock stat
            unlocked: false
        }
    ]);

    checkAchievements() {
        const stats = {
            stars: this.gameStore.stars(),
            // Add more stats tracked in gameStore later
        };

        this.badges.update(currentBadges => {
            return currentBadges.map(badge => {
                if (!badge.unlocked && badge.condition(stats)) {
                    this.unlockBadge(badge);
                    return { ...badge, unlocked: true };
                }
                return badge;
            });
        });
    }

    private unlockBadge(badge: Badge) {
        this.mascot.celebrate();
        // Show toast or modal
        console.log(`Unlocked Badge: ${badge.name}`);
        // Ideally use a ToastService here
    }
}
