import { Component, signal, OnInit, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentProfileService, StudentProfileResponse, Achievement, WeeklyAchievement } from '../../../core/services/student-profile.service';

@Component({
  selector: 'app-student-profile-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Student Profile Card -->
      @if (profileData()) {
        <div class="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-3xl p-6 border-4 border-pink-300 shadow-xl">
          <div class="flex items-center gap-4 mb-4">
            <!-- Avatar -->
            <div class="relative">
              <div class="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                @if (profileData()!.student.avatar) {
                  <img [src]="profileData()!.student.avatar" [alt]="profileData()!.student.name" class="w-full h-full object-cover">
                } @else {
                  <div class="w-full h-full flex items-center justify-center text-4xl">👧</div>
                }
              </div>
              <div class="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-6 h-6 border-2 border-white"></div>
            </div>

            <!-- Student Info -->
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-800">{{ profileData()!.student.name }}</h2>
              <div class="flex items-center gap-2 mt-1">
                <span class="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                  LEVEL {{ profileData()!.student.level }}
                </span>
                <span class="text-blue-600 flex items-center gap-1">
                  ⭐ {{ profileData()!.student.totalStars }} Sao
                </span>
              </div>
            </div>
          </div>

          <!-- XP Progress Bar -->
          <div class="mb-4">
            <div class="flex justify-between text-sm text-gray-600 mb-2">
              <span>TIẾN ĐỘ LEVEL TIẾP THEO</span>
              <span class="font-bold">{{ profileData()!.student.xp.currentLevelProgress }} / {{ profileData()!.student.xp.xpNeededForNextLevel }} XP</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-orange-400 to-pink-500 rounded-full transition-all duration-500"
                [style.width.%]="profileData()!.student.xp.percentage">
              </div>
            </div>
          </div>

          <!-- Today Stats -->
          <div class="grid grid-cols-3 gap-4">
            <div class="bg-white rounded-xl p-4 text-center shadow-md border border-cyan-200">
              <div class="text-3xl mb-1">📚</div>
              <div class="text-2xl font-bold text-cyan-600">{{ profileData()!.todayStats.lessonsCompleted }}</div>
              <div class="text-xs text-gray-500">BÀI HỌC HÔM NAY</div>
            </div>
            <div class="bg-white rounded-xl p-4 text-center shadow-md border border-green-200">
              <div class="text-3xl mb-1">✅</div>
              <div class="text-2xl font-bold text-green-600">{{ profileData()!.todayStats.correctAnswers }}</div>
              <div class="text-xs text-gray-500">CÂU TRẢ LỜI ĐÚNG</div>
            </div>
            <div class="bg-white rounded-xl p-4 text-center shadow-md border border-red-200">
              <div class="text-3xl mb-1">⏱️</div>
              <div class="text-2xl font-bold text-red-600">{{ profileData()!.todayStats.minutesLearned }}</div>
              <div class="text-xs text-gray-500">PHÚT HỌC TẬP</div>
            </div>
          </div>
        </div>
      }

      <!-- Phiếu Bé Ngoan Section -->
      <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-pink-600 flex items-center gap-2">
            <span class="text-3xl">🏆</span>
            Phiếu Bé Ngoan
          </h2>
          <button
            (click)="viewAllAchievements()"
            class="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:shadow-lg transition-all flex items-center gap-2">
            📋 Xem tất cả phiếu
          </button>
        </div>

        <!-- Weekly Achievements -->
        @if (weeklyAchievements().length > 0) {
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            @for (achievement of weeklyAchievements(); track achievement.id) {
              <div class="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border-2 border-yellow-300 shadow-md hover:shadow-xl transition-all">
                <div class="flex items-center gap-3">
                  <div class="text-4xl">{{ achievement.icon }}</div>
                  <div class="flex-1">
                    <h3 class="font-bold text-gray-800">{{ achievement.title }}</h3>
                    <p class="text-sm text-gray-600">{{ achievement.description }}</p>
                    <p class="text-xs text-gray-500 mt-1">📅 {{ formatDate(achievement.earnedAt) }}</p>
                  </div>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="text-center py-8 text-gray-400">
            <div class="text-6xl mb-3">🎯</div>
            <p class="text-lg">Chưa có phiếu bé ngoan nào trong tuần này</p>
            <p class="text-sm">Hãy cố gắng học tập để nhận phiếu nhé!</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class StudentProfileCardComponent implements OnInit {
  private studentProfileService = inject(StudentProfileService);

  // Input: student ID
  studentId = input.required<string>();

  // Signals
  profileData = signal<StudentProfileResponse | null>(null);
  weeklyAchievements = signal<WeeklyAchievement[]>([]);
  allAchievements = signal<Achievement[]>([]);
  loading = signal(true);

  async ngOnInit() {
    await this.loadProfileData();
  }

  async loadProfileData() {
    this.loading.set(true);
    try {
      const userId = this.studentId();

      // Load profile and weekly achievements in parallel
      const [profile, weekly] = await Promise.all([
        this.studentProfileService.getStudentProfile(userId),
        this.studentProfileService.getWeeklyAchievements(userId)
      ]);

      this.profileData.set(profile);
      this.weeklyAchievements.set(weekly);
    } catch (error: any) {
      console.error('Failed to load student profile:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async viewAllAchievements() {
    // Load all achievements when user clicks "View All"
    try {
      const response = await this.studentProfileService.getStudentAchievements(this.studentId());
      this.allAchievements.set(response.data);
      // TODO: Open modal or navigate to achievements page
      console.log('All achievements:', response.data);
    } catch (error: any) {
      console.error('Failed to load all achievements:', error);
    }
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  }
}
