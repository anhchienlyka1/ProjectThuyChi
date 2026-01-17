import { Component, signal, computed, OnInit, Signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentSwitcherService, Student } from '../../core/services/student-switcher.service';
import { AuthService } from '../../core/services/auth.service';
import { AchievementService } from '../../core/services/achievement.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { StudentProfileCardComponent } from '../../shared/components/student-profile-card/student-profile-card.component';

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
  imports: [CommonModule, StudentProfileCardComponent],
  templateUrl: './parent-dashboard.component.html',
  styles: [`
    :host {
      display: block;
    }
    /* Premium Scrollbar */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  `]
})
// Trigger rebuild
export class ParentDashboardComponent implements OnInit {
  private studentSwitcherService = inject(StudentSwitcherService);
  private achievementService = inject(AchievementService);
  private dashboardService = inject(DashboardService);
  selectedStudent = this.studentSwitcherService.selectedStudent;

  ngOnInit(): void {
    // Listen for student changes to reload data
    window.addEventListener('studentChanged', () => {
      this.loadDashboardData();
    });
    // Initial load
    this.loadDashboardData();
  }

  async loadDashboardData(): Promise<void> {
    const student = this.selectedStudent();
    console.log('Loading data for student:', student?.name);

    if (student) {
      try {
        // 1. Fetch Overview (Stats, Subject Progress)
        const overview = await this.dashboardService.getParentOverview(student.id);

        this.todayStats.set({
          lessonsCompleted: overview.dailySummary.lessonsCompleted,
          totalMinutes: overview.dailySummary.minutesLearned,
          averageScore: overview.dailySummary.avgScore
        });

        this.weekStats.set({
          totalTime: overview.weeklyStats.totalTime.value,
          timeTrend: overview.weeklyStats.totalTime.trend,
          completedLessons: overview.weeklyStats.lessonsCompleted.value,
          lessonsTrend: overview.weeklyStats.lessonsCompleted.trend,
          averageScore: overview.weeklyStats.avgScore.value,
          scoreTrend: overview.weeklyStats.avgScore.trend,
          badges: overview.weeklyStats.badges.value,
          badgesNew: overview.weeklyStats.badges.newThisWeek
        });

        this.subjectProgress.set(overview.subjectProgress.map(s => ({
          subject: s.subjectName,
          icon: this.getSubjectIcon(s.subjectId),
          color: s.color || '0', // Hue rotate value or color
          progress: s.percentage,
          completedLessons: s.completedLevels,
          totalLessons: s.totalLevels
        })));


        // 2. Fetch Recent Activities
        const history = await this.dashboardService.getRecentHistory(student.id);
        const mappedHistory: LearningActivity[] = history.map((h: any) => ({
          id: h.id,
          subject: h.level?.subject?.title || 'Unknown',
          module: h.level?.title || 'Unknown Module',
          score: h.score,
          totalQuestions: h.totalQuestions,
          duration: Math.round(h.durationSeconds / 60),
          timestamp: new Date(h.startedAt),
          icon: this.getSubjectIcon(h.level?.subjectId),
          color: '#3B82F6' // Default or mapped from subject
        }));
        this.recentActivities.set(mappedHistory);

        // 3. Fetch Badges
        // Need to load them for full list or other uses if desired, but count is covered by weekStats

      } catch (error) {
        console.error('Failed to load dashboard data', error);
      }
    }
  }

  // --- Signals ---

  recentActivities = signal<LearningActivity[]>([]);
  achievements = signal<Achievement[]>([]); // Optional if we don't display list

  subjectProgress = signal<SubjectProgress[]>([]);

  todayStats = signal({
    lessonsCompleted: 0,
    totalMinutes: 0,
    averageScore: 0
  });

  weekStats = signal({
    totalTime: '0h 0m',
    timeTrend: '+0%',
    completedLessons: 0,
    lessonsTrend: '+0',
    averageScore: '0%',
    scoreTrend: '+0%',
    badges: 0,
    badgesNew: 0
  });

  // --- Helpers ---

  getSubjectIcon(subjectId: string): string {
    switch (subjectId) {
      case 'math': return '🔢';
      case 'vietnamese': return '📝';
      case 'english': return '🔤';
      default: return '🎮';
    }
  }

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
    if (total === 0) return 'text-slate-500';
    const percentage = (score / total) * 100;
    if (percentage >= 90) return 'text-emerald-600';
    if (percentage >= 70) return 'text-indigo-600';
    if (percentage >= 50) return 'text-amber-600';
    return 'text-rose-600';
  }

  getProgressColor(progress: number): string {
    if (progress >= 80) return '#10B981';
    if (progress >= 60) return '#3B82F6';
    if (progress >= 40) return '#F59E0B';
    return '#EF4444';
  }

  getProgressGradient(progress: number): string {
    if (progress >= 80) return 'linear-gradient(90deg, #10B981, #34D399)'; // Emerald
    if (progress >= 60) return 'linear-gradient(90deg, #6366F1, #818CF8)'; // Indigo
    if (progress >= 40) return 'linear-gradient(90deg, #F59E0B, #FBBF24)'; // Amber
    return 'linear-gradient(90deg, #F43F5E, #FB7185)'; // Rose
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
