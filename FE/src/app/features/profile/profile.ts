import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GamificationStore } from '../../core/store/gamification.store';
import { ReportService } from '../../core/services/report.service';
import { AchievementService } from '../../core/services/achievement.service';
import { KidCardComponent } from '../../shared/ui-kit/kid-card/kid-card.component';
import { KidAvatarComponent } from '../../shared/ui-kit/kid-avatar/kid-avatar.component';
import { KidProgressBarComponent } from '../../shared/ui-kit/kid-progress-bar/kid-progress-bar.component';
import { KidButtonComponent } from '../../shared/ui-kit/kid-button/kid-button.component';


export interface Certificate {
  id: string;
  name: string;
  description: string;
  date?: string;
  unlocked: boolean;
  theme: 'pink' | 'blue' | 'yellow' | 'green';
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    KidCardComponent,
    KidAvatarComponent,
    KidProgressBarComponent,
    KidButtonComponent
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent {
  gameStore = inject(GamificationStore);
  reportService = inject(ReportService);
  achievementService = inject(AchievementService);
  private router = inject(Router);

  // Mock computed certificates for the profile preview (latest 4)
  recentCertificates = computed(() => {
    const allCerts: Certificate[] = [
      {
        id: 'cert_1',
        name: 'Bé Ngoan Tuần 1',
        description: 'Hoàn thành xuất sắc bài tập tuần 1',
        date: '01/01/2026',
        unlocked: true,
        theme: 'pink'
      },
      {
        id: 'cert_2',
        name: 'Bé Ngoan Tuần 2',
        description: 'Chăm chỉ học toán mỗi ngày',
        date: '08/01/2026',
        unlocked: true,
        theme: 'blue'
      },
      {
        id: 'cert_3',
        name: 'Bé Ngoan Tuần 3',
        description: 'Đạt điểm tối đa 3 bài kiểm tra',
        unlocked: false,
        theme: 'yellow'
      },
      {
        id: 'cert_4',
        name: 'Bé Ngoan Tháng 1',
        description: 'Hoàn thành mọi thử thách tháng 1',
        unlocked: false,
        theme: 'green'
      }
    ];
    return allCerts.slice(0, 4);
  });

  // Computed for Today's Stats
  todayStats = computed(() => {
    const today = new Date().toDateString();
    const sessions = this.reportService.sessions().filter(s => new Date(s.timestamp).toDateString() === today);

    return {
      lessons: sessions.length,
      correct: sessions.reduce((acc, curr) => acc + curr.correctAnswers, 0),
      durationMinutes: Math.floor(sessions.reduce((acc, curr) => acc + curr.durationSeconds, 0) / 60)
    };
  });

  constructor() {
    // Check for achievements whenever profile is loaded
    this.achievementService.checkAchievements();
  }

  goBack() {
    this.router.navigate(['/select-subject']);
  }



  viewAllCertificates() {
    this.router.navigate(['/profile/certificates']);
  }
}
