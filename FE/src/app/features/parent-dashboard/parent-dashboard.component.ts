import { Component, signal, computed, OnInit, Signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentSwitcherService, Student } from '../../core/services/student-switcher.service';
import { AuthService } from '../../core/services/auth.service';
import { AchievementService } from '../../core/services/achievement.service';
import { DashboardService, SubjectAchievement } from '../../core/services/dashboard.service';
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
  imports: [CommonModule],
  templateUrl: './parent-dashboard.component.html',
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

    :host {
      display: block;
      font-family: 'Nunito', sans-serif;
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

    /* Blob Animation */
    @keyframes blob {
      0%, 100% {
        transform: translate(0, 0) scale(1);
      }
      25% {
        transform: translate(20px, -50px) scale(1.1);
      }
      50% {
        transform: translate(-20px, 20px) scale(0.9);
      }
      75% {
        transform: translate(50px, 50px) scale(1.05);
      }
    }

    .animate-blob {
      animation: blob 7s infinite;
    }

    .animation-delay-2000 {
      animation-delay: 2s;
    }

    .animation-delay-4000 {
      animation-delay: 4s;
    }

    /* Floating Math Animation */
    @keyframes float-math {
      0%, 100% {
        transform: translateY(0px) rotate(0deg);
      }
      50% {
        transform: translateY(-20px) rotate(10deg);
      }
    }

    .animate-float-math {
      animation: float-math 6s ease-in-out infinite;
    }

    .animation-delay-1000 {
      animation-delay: 1s;
    }

    .animation-delay-3000 {
      animation-delay: 3s;
    }

    /* Fade In Animation */
    @keyframes fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .animate-fade-in {
      animation: fade-in 0.6s ease-out;
    }

    /* Fade In Up Animation */
    @keyframes fade-in-up {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fade-in-up {
      animation: fade-in-up 0.8s ease-out 0.2s backwards;
    }

    /* Slide Down Animation */
    @keyframes slide-down {
      from {
        opacity: 0;
        transform: translateY(-30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-slide-down {
      animation: slide-down 0.8s ease-out 0.1s backwards;
    }

    /* Pulse Slow Animation */
    @keyframes pulse-slow {
      0%, 100% {
        opacity: 0.3;
        transform: scale(1);
      }
      50% {
        opacity: 0.5;
        transform: scale(1.05);
      }
    }

    .animate-pulse-slow {
      animation: pulse-slow 4s ease-in-out infinite;
    }

    /* Bounce Slow Animation */
    @keyframes bounce-slow {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    .animate-bounce-slow {
      animation: bounce-slow 2s ease-in-out infinite;
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

        // 3. Fetch Subject Achievements (detailed per-subject stats)
        const achievementsResponse = await this.dashboardService.getSubjectAchievements(student.id);
        this.subjectAchievements.set(achievementsResponse.subjectAchievements);

        // 4. Fetch Badges
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
  subjectAchievements = signal<SubjectAchievement[]>([]);

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

  // --- Nhận Xét & Đề Xuất Methods ---

  getPositiveComment(): string {
    const stats = this.weekStats();
    const today = this.todayStats();
    const student = this.selectedStudent();

    // Dynamic positive comments based on actual performance
    if (today.lessonsCompleted >= 5) {
      return `Bé đã hoàn thành ${today.lessonsCompleted} bài học hôm nay. Thật tuyệt vời! Hãy tiếp tục phát huy nhé!`;
    }
    if (stats.completedLessons >= 10) {
      return `Bé đã duy trì học đều đặn ${stats.completedLessons} bài tuần này. Thật tuyệt vời! Hãy tiếp tục phát huy nhé!`;
    }
    if (today.averageScore >= 80) {
      return `Điểm số hôm nay rất ấn tượng (${today.averageScore}%)! Bé đang tiến bộ rất nhanh. Cố lên nhé!`;
    }
    if (today.totalMinutes >= 30) {
      return `Bé đã học tập chăm chỉ ${today.totalMinutes} phút hôm nay. Sự kiên trì sẽ mang lại kết quả tuyệt vời!`;
    }

    return 'Bé đang có những bước tiến tốt trong học tập. Hãy tiếp tục cố gắng nhé!';
  }

  getImprovementSuggestion(): string {
    const today = this.todayStats();
    const stats = this.weekStats();
    const activities = this.recentActivities();

    // Find subjects with lower scores for targeted suggestions
    const lowScoreActivities = activities.filter(a =>
      a.totalQuestions > 0 && (a.score / a.totalQuestions) < 0.7
    );

    if (lowScoreActivities.length > 0) {
      const subject = lowScoreActivities[0].subject;
      return `Bé có thể xem lại môn ${subject} để củng cố kiến thức. Luyện tập thường xuyên sẽ giúp bé tiến bộ nhanh hơn!`;
    }

    if (today.totalMinutes < 15) {
      return 'Thời gian học tốt nhất của bé là buổi sáng (8-10h). Hãy tận dụng khung giờ vàng này để đạt hiệu quả cao nhất!';
    }

    if (today.lessonsCompleted < 2) {
      return 'Hãy khuyến khích bé học thêm 1-2 bài mỗi ngày. Học tập đều đặn giúp bé ghi nhớ tốt hơn!';
    }

    return 'Thời gian học tốt nhất của bé là buổi sáng (8-10h). Hãy tận dụng khung giờ vàng này để đạt hiệu quả cao nhất!';
  }

  getNextWeekGoal(): string {
    const stats = this.weekStats();
    const subjects = this.subjectProgress();
    const student = this.selectedStudent();

    // Find subject with lowest progress
    const lowestProgressSubject = subjects.reduce((min, s) =>
      s.progress < min.progress ? s : min,
      subjects[0] || { subject: 'Toán', progress: 0, totalLessons: 20, completedLessons: 0 }
    );

    if (lowestProgressSubject && lowestProgressSubject.progress < 50) {
      const remaining = lowestProgressSubject.totalLessons - lowestProgressSubject.completedLessons;
      const target = Math.min(3, remaining);
      return `Hoàn thành thêm ${target} bài học ${lowestProgressSubject.subject} để đạt mốc ${lowestProgressSubject.completedLessons + target} bài trong tháng! Bé đã rất gần với mục tiêu rồi đấy!`;
    }

    if (stats.completedLessons < 15) {
      return `Hoàn thành thêm ${15 - stats.completedLessons} bài học để đạt mục tiêu 15 bài/tuần! Bé làm được mà!`;
    }

    return 'Duy trì thói quen học tập tốt và thử thách bản thân với các bài khó hơn. Bé sẽ tiến xa hơn nữa!';
  }
}
