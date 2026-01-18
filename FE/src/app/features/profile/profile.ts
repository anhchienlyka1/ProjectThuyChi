import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GamificationStore } from '../../core/store/gamification.store';
import { ReportService } from '../../core/services/report.service';
import { AchievementService } from '../../core/services/achievement.service';
import { StudentProfileService, Achievement } from '../../core/services/student-profile.service';
import { AuthService } from '../../core/services/auth.service';
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
  studentProfileService = inject(StudentProfileService);
  authService = inject(AuthService);
  private router = inject(Router);

  // Signals for profile data
  isLoading = signal<boolean>(true);
  profileData = signal<any>(null);
  achievements = signal<Achievement[]>([]);

  // Computed for recent certificates (map from achievements)
  recentCertificates = signal<Certificate[]>([]);

  // Computed for Today's Stats from API
  todayStats = signal({
    lessons: 0,
    correct: 0,
    durationMinutes: 0
  });

  constructor() {
    // Load profile data when component initializes
    this.loadProfileData();

    // Check for achievements whenever profile is loaded
    this.achievementService.checkAchievements();
  }

  async loadProfileData() {
    try {
      this.isLoading.set(true);
      const userId = this.authService.getUserId();

      if (!userId) {
        console.error('No user ID found');
        this.isLoading.set(false);
        return;
      }

      // Fetch profile data
      const profile = await this.studentProfileService.getStudentProfile(userId);
      this.profileData.set(profile);

      // Sync with Gamification Store
      if (profile.student) {
        this.gameStore.syncProfile(profile.student);
      }

      // Update today's stats from API
      if (profile.todayStats) {
        this.todayStats.set({
          lessons: profile.todayStats.lessonsCompleted,
          correct: profile.todayStats.correctAnswers,
          durationMinutes: profile.todayStats.minutesLearned
        });
      }

      // Fetch achievements (limit to 6 for profile preview)
      const response = await this.studentProfileService.getStudentAchievements(userId, 1, 6);
      const achievementsData = response.data;
      this.achievements.set(achievementsData);

      // Map achievements to certificates format
      const certs: Certificate[] = achievementsData.map((achievement, index) => {
        const themes: Array<'pink' | 'blue' | 'yellow' | 'green'> = ['pink', 'blue', 'yellow', 'green'];
        return {
          id: achievement.id.toString(),
          name: achievement.title,
          description: achievement.description,
          date: new Date(achievement.earnedAt).toLocaleDateString('vi-VN'),
          unlocked: true,
          theme: themes[index % themes.length]
        };
      });
      this.recentCertificates.set(certs);

    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  goBack() {
    this.router.navigate(['/select-subject']);
  }

  viewAllCertificates() {
    this.router.navigate(['/profile/certificates']);
  }
}
