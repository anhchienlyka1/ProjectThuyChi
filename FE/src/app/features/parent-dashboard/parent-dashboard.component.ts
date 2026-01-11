import { Component, signal, computed, OnInit, Signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentSwitcherService, Student } from '../../core/services/student-switcher.service';
import { AuthService } from '../../core/services/auth.service';
import { RouterLink } from '@angular/router';

interface LearningActivity {
  id: number;
  subject: string;
  module: string;
  score: number;
  totalQuestions: number;
  duration: number; // in minutes
  timestamp: Date;
  icon: string;
  color: string;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  earnedDate: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface SubjectProgress {
  subject: string;
  icon: string;
  color: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
}

@Component({
  selector: 'app-parent-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto space-y-6">

      <!-- Welcome Header -->
      <div class="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 rounded-3xl p-8 text-white shadow-xl">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold mb-2">👋 Xin chào, Phụ Huynh!</h1>
            <p class="text-white/90 text-lg">
              @if (selectedStudent()) {
                Hôm nay <strong>{{ selectedStudent()?.name }}</strong> đã học được {{ todayStats().lessonsCompleted }} bài và đạt {{ todayStats().averageScore }}% điểm trung bình
              } @else {
                Hôm nay bé đã học được {{ todayStats().lessonsCompleted }} bài và đạt {{ todayStats().averageScore }}% điểm trung bình
              }
            </p>
          </div>
          <div class="hidden md:block">
            <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div class="text-4xl font-bold">{{ todayStats().totalMinutes }}</div>
              <div class="text-sm text-white/80">Phút học hôm nay</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Learning Time -->
        <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
          <div class="flex items-center justify-between mb-4">
            <div class="bg-blue-100 rounded-xl p-3">
              <span class="text-3xl">⏰</span>
            </div>
            <span class="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Tuần này</span>
          </div>
          <div class="text-3xl font-bold text-gray-800 mb-1">{{ weekStats().totalHours }}h {{ weekStats().totalMinutes }}m</div>
          <div class="text-sm text-gray-500">Tổng thời gian học</div>
          <div class="mt-3 flex items-center text-xs text-green-600">
            <span class="mr-1">↗</span>
            <span>+15% so với tuần trước</span>
          </div>
        </div>

        <!-- Completed Lessons -->
        <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
          <div class="flex items-center justify-between mb-4">
            <div class="bg-green-100 rounded-xl p-3">
              <span class="text-3xl">✅</span>
            </div>
            <span class="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">Tuần này</span>
          </div>
          <div class="text-3xl font-bold text-gray-800 mb-1">{{ weekStats().completedLessons }}</div>
          <div class="text-sm text-gray-500">Bài học hoàn thành</div>
          <div class="mt-3 flex items-center text-xs text-green-600">
            <span class="mr-1">↗</span>
            <span>+8 bài so với tuần trước</span>
          </div>
        </div>

        <!-- Average Score -->
        <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
          <div class="flex items-center justify-between mb-4">
            <div class="bg-yellow-100 rounded-xl p-3">
              <span class="text-3xl">⭐</span>
            </div>
            <span class="text-sm font-semibold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">Tuần này</span>
          </div>
          <div class="text-3xl font-bold text-gray-800 mb-1">{{ weekStats().averageScore }}%</div>
          <div class="text-sm text-gray-500">Điểm trung bình</div>
          <div class="mt-3 flex items-center text-xs text-green-600">
            <span class="mr-1">↗</span>
            <span>+5% so với tuần trước</span>
          </div>
        </div>

        <!-- Achievements -->
        <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
          <div class="flex items-center justify-between mb-4">
            <div class="bg-purple-100 rounded-xl p-3">
              <span class="text-3xl">🏆</span>
            </div>
            <span class="text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">Tổng cộng</span>
          </div>
          <div class="text-3xl font-bold text-gray-800 mb-1">{{ achievements().length }}</div>
          <div class="text-sm text-gray-500">Phiếu Bé Ngoan đạt được</div>
          <div class="mt-3 flex items-center text-xs text-purple-600">
            <span class="mr-1">🎉</span>
            <span>+3 phiếu mới tuần này</span>
          </div>
        </div>
      </div>

      <!-- Subject Progress -->
      <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-800">📚 Tiến độ theo môn học</h2>
          <button class="text-sm text-blue-600 hover:text-blue-700 font-semibold">Xem chi tiết →</button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (subject of subjectProgress(); track subject.subject) {
            <div class="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div class="flex items-center gap-3 mb-4">
                <div class="text-4xl" [style.filter]="'hue-rotate(' + subject.color + 'deg)'">{{ subject.icon }}</div>
                <div class="flex-1">
                  <h3 class="font-bold text-gray-800">{{ subject.subject }}</h3>
                  <p class="text-xs text-gray-500">{{ subject.completedLessons }}/{{ subject.totalLessons }} bài</p>
                </div>
                <div class="text-2xl font-bold" [style.color]="getProgressColor(subject.progress)">
                  {{ subject.progress }}%
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  [style.width.%]="subject.progress"
                  [style.background]="getProgressGradient(subject.progress)">
                </div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Recent Activities & Achievements -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- Recent Learning Activities -->
        <div class="lg:col-span-2 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-800">📝 Hoạt động học tập gần đây</h2>
            <button class="text-sm text-blue-600 hover:text-blue-700 font-semibold">Xem tất cả →</button>
          </div>

          <div class="space-y-4">
            @for (activity of recentActivities(); track activity.id) {
              <div class="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
                <div class="rounded-xl p-3 text-3xl" [style.background]="activity.color + '20'">
                  {{ activity.icon }}
                </div>
                <div class="flex-1">
                  <h3 class="font-bold text-gray-800">{{ activity.module }}</h3>
                  <p class="text-sm text-gray-500">{{ activity.subject }} • {{ formatTime(activity.timestamp) }}</p>
                </div>
                <div class="text-right">
                  <div class="font-bold text-lg" [class]="getScoreClass(activity.score, activity.totalQuestions)">
                    {{ activity.score }}/{{ activity.totalQuestions }}
                  </div>
                  <div class="text-xs text-gray-500">{{ activity.duration }} phút</div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Phiếu Bé Ngoan -->
        <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-800">🏆 Phiếu Bé Ngoan</h2>
          </div>

          <div class="space-y-4">
            @for (achievement of achievements().slice(0, 5); track achievement.id) {
              <div class="p-4 rounded-xl border-2 transition-all hover:scale-105"
                [class]="getAchievementBorderClass(achievement.rarity)">
                <div class="flex items-start gap-3">
                  <div class="text-3xl">{{ achievement.icon }}</div>
                  <div class="flex-1">
                    <h3 class="font-bold text-sm text-gray-800">{{ achievement.title }}</h3>
                    <p class="text-xs text-gray-500 mt-1">{{ achievement.description }}</p>
                    <p class="text-xs text-gray-400 mt-2">{{ formatDate(achievement.earnedDate) }}</p>
                  </div>
                </div>
              </div>
            }
          </div>

          <button
            routerLink="/parents/badge-management"
            class="w-full mt-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow">
            Xem tất cả phiếu bé ngoan
          </button>
        </div>

      </div>

      <!-- Quick Actions -->
      <div class="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">⚡ Thao tác nhanh</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

          <button class="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all hover:scale-105 text-left border border-gray-100">
            <div class="text-4xl mb-3">⏱️</div>
            <h3 class="font-bold text-lg text-gray-800 mb-1">Cài đặt thời gian</h3>
            <p class="text-sm text-gray-500">Quản lý thời gian học mỗi ngày</p>
          </button>

          <button class="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all hover:scale-105 text-left border border-gray-100">
            <div class="text-4xl mb-3">📊</div>
            <h3 class="font-bold text-lg text-gray-800 mb-1">Báo cáo chi tiết</h3>
            <p class="text-sm text-gray-500">Xem báo cáo tiến độ đầy đủ</p>
          </button>

          <button class="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all hover:scale-105 text-left border border-gray-100">
            <div class="text-4xl mb-3">🎯</div>
            <h3 class="font-bold text-lg text-gray-800 mb-1">Đặt mục tiêu</h3>
            <p class="text-sm text-gray-500">Thiết lập mục tiêu học tập</p>
          </button>

        </div>
      </div>

    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ParentDashboardComponent implements OnInit {
  private studentSwitcherService = inject(StudentSwitcherService);
  selectedStudent = this.studentSwitcherService.selectedStudent;

  ngOnInit(): void {
    // Listen for student changes to reload data
    window.addEventListener('studentChanged', () => {
      this.loadDashboardData();
    });
  }

  loadDashboardData(): void {
    // TODO: Load dashboard data based on selected student
    console.log('Loading data for student:', this.selectedStudent()?.name);
  }

  // Mock data - In production, this would come from a service
  recentActivities = signal<LearningActivity[]>([
    { id: 1, subject: 'Toán Học', module: 'Phép Cộng 1-10', score: 9, totalQuestions: 10, duration: 12, timestamp: new Date(Date.now() - 1000 * 60 * 30), icon: '➕', color: '#3B82F6' },
    { id: 2, subject: 'Tiếng Việt', module: 'Bảng Chữ Cái', score: 15, totalQuestions: 15, duration: 18, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), icon: '📝', color: '#10B981' },
    { id: 3, subject: 'Toán Học', module: 'So Sánh Số', score: 7, totalQuestions: 10, duration: 15, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), icon: '⚖️', color: '#3B82F6' },
    { id: 4, subject: 'Trò Chơi', module: 'Đường Đua Trí Tuệ', score: 12, totalQuestions: 15, duration: 20, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), icon: '🎮', color: '#F59E0B' },
    { id: 5, subject: 'Tiếng Việt', module: 'Ghép Từ Đơn', score: 8, totalQuestions: 10, duration: 14, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), icon: '🔤', color: '#10B981' }
  ]);

  achievements = signal<Achievement[]>([
    { id: 1, title: 'Nhà Toán Học Nhí', description: 'Hoàn thành 50 bài toán', icon: '🧮', earnedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), rarity: 'epic' },
    { id: 2, title: 'Streak 7 Ngày', description: 'Học liên tục 7 ngày', icon: '🔥', earnedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), rarity: 'rare' },
    { id: 3, title: 'Điểm 10 Hoàn Hảo', description: 'Đạt 10/10 điểm', icon: '💯', earnedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), rarity: 'legendary' },
    { id: 4, title: 'Người Bạn Chữ', description: 'Học hết bảng chữ cái', icon: '📚', earnedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), rarity: 'common' },
    { id: 5, title: 'Tốc Độ Ánh Sáng', description: 'Hoàn thành bài trong 5 phút', icon: '⚡', earnedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), rarity: 'rare' }
  ]);

  subjectProgress = signal<SubjectProgress[]>([
    { subject: 'Toán Học', icon: '🔢', color: '0', progress: 75, completedLessons: 15, totalLessons: 20 },
    { subject: 'Tiếng Việt', icon: '📝', color: '120', progress: 60, completedLessons: 12, totalLessons: 20 },
    { subject: 'Tiếng Anh', icon: '🔤', color: '200', progress: 40, completedLessons: 8, totalLessons: 20 },
    { subject: 'Trò Chơi', icon: '🎮', color: '280', progress: 85, completedLessons: 17, totalLessons: 20 }
  ]);

  todayStats = computed(() => {
    const today = this.recentActivities().filter(a => {
      const activityDate = new Date(a.timestamp);
      const now = new Date();
      return activityDate.toDateString() === now.toDateString();
    });
    const totalMinutes = today.reduce((sum, a) => sum + a.duration, 0);
    const totalScore = today.reduce((sum, a) => sum + a.score, 0);
    const totalQuestions = today.reduce((sum, a) => sum + a.totalQuestions, 0);
    const averageScore = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
    return { lessonsCompleted: today.length, totalMinutes, averageScore };
  });

  weekStats = computed(() => {
    return { totalHours: 12, totalMinutes: 35, completedLessons: 42, averageScore: 87 };
  });

  formatTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days} ngày trước`;
    if (hours > 0) return `${hours} giờ trước`;
    if (minutes > 0) return `${minutes} phút trước`;
    return 'Vừa xong';
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
  }

  getScoreClass(score: number, total: number): string {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  }

  getProgressColor(progress: number): string {
    if (progress >= 80) return '#10B981';
    if (progress >= 60) return '#3B82F6';
    if (progress >= 40) return '#F59E0B';
    return '#EF4444';
  }

  getProgressGradient(progress: number): string {
    if (progress >= 80) return 'linear-gradient(90deg, #10B981, #059669)';
    if (progress >= 60) return 'linear-gradient(90deg, #3B82F6, #2563EB)';
    if (progress >= 40) return 'linear-gradient(90deg, #F59E0B, #D97706)';
    return 'linear-gradient(90deg, #EF4444, #DC2626)';
  }

  getAchievementBorderClass(rarity: string): string {
    switch (rarity) {
      case 'legendary': return 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50';
      case 'epic': return 'border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50';
      case 'rare': return 'border-blue-400 bg-gradient-to-br from-blue-50 to-cyan-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  }
}
