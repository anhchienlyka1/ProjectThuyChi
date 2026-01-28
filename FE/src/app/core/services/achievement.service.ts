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

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AchievementService {
  private gameStore = inject(GamificationStore);
  private mascot = inject(MascotService);
  private http = inject(HttpClient);
  private API_URL = environment.apiUrl;

  async getAchievements(userId: string) {
    try {
      return await firstValueFrom(
        this.http.get<any[]>(`${this.API_URL}/dashboard/achievements?userId=${userId}`)
      );
    } catch (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }
  }

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
      condition: (stats) => stats.mathCompleted >= 5,
      unlocked: false
    },
    {
      id: 'star_collector',
      name: 'Nhà Sưu Tập Sao',
      description: 'Kiếm được 50 ngôi sao',
      icon: '⭐',
      condition: (stats) => stats.stars >= 50,
      unlocked: false
    },
    {
      id: 'level_5',
      name: 'Chinh Phục Cấp 5',
      description: 'Đạt cấp độ 5',
      icon: '🏆',
      condition: (stats) => stats.level >= 5,
      unlocked: false
    },
    {
      id: 'perfect_score',
      name: 'Điểm Số Hoàn Hảo',
      description: 'Trả lời đúng 20 câu liên tiếp',
      icon: '💯',
      condition: (stats) => stats.perfectStreak >= 20,
      unlocked: false
    },
    {
      id: 'early_bird',
      name: 'Chim Sớm',
      description: 'Học bài trước 8 giờ sáng',
      icon: '🐦',
      condition: (stats) => stats.earlyMorning >= 1,
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
    // Show toast or modal
    console.log(`Unlocked Badge: ${badge.name}`);
    // Ideally use a ToastService here
  }

  // CRUD Operations
  addBadge(badge: Badge) {
    this.badges.update(badges => [...badges, badge]);
    console.log('Badge added:', badge.name);
  }

  updateBadge(updatedBadge: Badge) {
    this.badges.update(badges =>
      badges.map(badge =>
        badge.id === updatedBadge.id ? updatedBadge : badge
      )
    );
    console.log('Badge updated:', updatedBadge.name);
  }

  deleteBadge(badgeId: string) {
    this.badges.update(badges =>
      badges.filter(badge => badge.id !== badgeId)
    );
    console.log('Badge deleted:', badgeId);
  }

  getBadgeById(badgeId: string): Badge | undefined {
    return this.badges().find(badge => badge.id === badgeId);
  }
}
