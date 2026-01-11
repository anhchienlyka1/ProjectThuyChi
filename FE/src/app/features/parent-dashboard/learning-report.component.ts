import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentSwitcherComponent } from '../../shared/components/student-switcher.component';
import { StudentSwitcherService } from '../../core/services/student-switcher.service';

interface WeeklyStats {
  totalMinutes: number;
  totalLessons: number;
  averageScore: number;
  streak: number;
  improvement: number; // percentage
}

interface SubjectReport {
  subject: string;
  icon: string;
  color: string;
  totalTime: number;
  lessonsCompleted: number;
  averageScore: number;
  strongAreas: string[];
  improvementAreas: string[];
  trend: 'up' | 'down' | 'stable';
}

interface DailyActivity {
  date: Date;
  totalMinutes: number;
  lessonsCompleted: number;
  averageScore: number;
}

interface Achievement {
  title: string;
  description: string;
  icon: string;
  earnedDate: Date;
  category: 'streak' | 'mastery' | 'speed' | 'perfect';
}

@Component({
  selector: 'app-learning-report',
  standalone: true,
  imports: [CommonModule, FormsModule, StudentSwitcherComponent],
  template: `
    <div class="learning-report-container">
      <!-- Header with Student Switcher -->
      <div class="report-header">
        <div class="header-content">
          <button class="back-button" (click)="goBack()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div class="header-title">
            <h1>📊 Báo Cáo Học Tập</h1>
            <p>Theo dõi tiến độ và phiếu bé ngoan của bé</p>
          </div>
        </div>
        <app-student-switcher></app-student-switcher>
      </div>

      <!-- Time Range Selector -->
      <div class="time-range-selector">
        <button
          *ngFor="let range of timeRanges"
          [class.active]="selectedTimeRange() === range.value"
          (click)="selectTimeRange(range.value)"
          class="range-button">
          {{ range.label }}
        </button>
      </div>

      <!-- Weekly Overview Cards -->
      <div class="overview-section">
        <h2 class="section-title">📈 Tổng Quan {{ getTimeRangeLabel() }}</h2>
        <div class="stats-grid">
          <div class="stat-card time-card">
            <div class="stat-icon">⏱️</div>
            <div class="stat-content">
              <div class="stat-value">{{ weeklyStats().totalMinutes }}</div>
              <div class="stat-label">Phút học</div>
              <div class="stat-change positive">+{{ weeklyStats().improvement }}%</div>
            </div>
          </div>

          <div class="stat-card lessons-card">
            <div class="stat-icon">📚</div>
            <div class="stat-content">
              <div class="stat-value">{{ weeklyStats().totalLessons }}</div>
              <div class="stat-label">Bài học</div>
              <div class="stat-change positive">+5 bài</div>
            </div>
          </div>

          <div class="stat-card score-card">
            <div class="stat-icon">⭐</div>
            <div class="stat-content">
              <div class="stat-value">{{ weeklyStats().averageScore }}%</div>
              <div class="stat-label">Điểm TB</div>
              <div class="stat-change" [class.positive]="weeklyStats().improvement > 0">
                {{ weeklyStats().improvement > 0 ? '+' : '' }}{{ weeklyStats().improvement }}%
              </div>
            </div>
          </div>

          <div class="stat-card streak-card">
            <div class="stat-icon">🔥</div>
            <div class="stat-content">
              <div class="stat-value">{{ weeklyStats().streak }}</div>
              <div class="stat-label">Ngày liên tiếp</div>
              <div class="stat-change positive">Tuyệt vời!</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Daily Activity Chart -->
      <div class="chart-section">
        <h2 class="section-title" >📊 Hoạt Động Hàng Ngày</h2>
        <div class="chart-container">
          <div class="chart-wrapper">
            <div class="chart-y-axis">
              <span>60</span>
              <span>45</span>
              <span>30</span>
              <span>15</span>
              <span>0</span>
            </div>
            <div class="chart-bars">
              <div *ngFor="let day of dailyActivities()" class="bar-group">
                <div class="bar-wrapper">
                  <div
                    class="bar"
                    [style.height.%]="getBarHeight(day.totalMinutes)"
                    [class.highlight]="isToday(day.date)">
                    <span class="bar-value">{{ day.totalMinutes }}</span>
                  </div>
                </div>
                <div class="bar-label">{{ formatDayLabel(day.date) }}</div>
              </div>
            </div>
          </div>
          <div class="chart-legend">
            <div class="legend-item">
              <span class="legend-color primary"></span>
              <span>Thời gian học (phút)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Subject Performance -->
      <div class="subjects-section">
        <h2 class="section-title">🎯 Phiếu Bé Ngoan Theo Môn</h2>
        <div class="subjects-grid">
          <div *ngFor="let subject of subjectReports()" class="subject-card">
            <div class="subject-header" [style.background]="subject.color">
              <div class="subject-icon">{{ subject.icon }}</div>
              <div class="subject-info">
                <h3>{{ subject.subject }}</h3>
                <p>{{ subject.lessonsCompleted }} bài đã hoàn thành</p>
              </div>
              <div class="subject-trend" [class]="subject.trend">
                <svg *ngIf="subject.trend === 'up'" width="20" height="20" viewBox="0 0 20 20">
                  <path d="M10 4L16 10L10 10L10 16L10 10L4 10L10 4Z" fill="currentColor"/>
                </svg>
                <svg *ngIf="subject.trend === 'down'" width="20" height="20" viewBox="0 0 20 20">
                  <path d="M10 16L4 10L10 10L10 4L10 10L16 10L10 16Z" fill="currentColor"/>
                </svg>
                <svg *ngIf="subject.trend === 'stable'" width="20" height="20" viewBox="0 0 20 20">
                  <path d="M4 10L16 10" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
            </div>

            <div class="subject-stats">
              <div class="subject-stat">
                <span class="stat-icon">⏱️</span>
                <span class="stat-text">{{ subject.totalTime }} phút</span>
              </div>
              <div class="subject-stat">
                <span class="stat-icon">⭐</span>
                <span class="stat-text">{{ subject.averageScore }}% điểm TB</span>
              </div>
            </div>

            <div class="subject-progress">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  [style.width.%]="subject.averageScore"
                  [style.background]="subject.color">
                </div>
              </div>
            </div>

            <div class="subject-details">
              <div class="detail-section" *ngIf="subject.strongAreas.length > 0">
                <h4>💪 Điểm mạnh</h4>
                <div class="tags">
                  <span *ngFor="let area of subject.strongAreas" class="tag strong">{{ area }}</span>
                </div>
              </div>
              <div class="detail-section" *ngIf="subject.improvementAreas.length > 0">
                <h4>📈 Cần cải thiện</h4>
                <div class="tags">
                  <span *ngFor="let area of subject.improvementAreas" class="tag improve">{{ area }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Achievements -->
      <div class="achievements-section">
        <h2 class="section-title">🏆 Phiếu Bé Ngoan Gần Đây</h2>
        <div class="achievements-grid">
          <div *ngFor="let achievement of recentAchievements()"
               class="achievement-card"
               [class]="getAchievementBorderClass(achievement.category)">
            <div class="achievement-icon">{{ achievement.icon }}</div>
            <div class="achievement-content">
              <h3>{{ achievement.title }}</h3>
              <p>{{ achievement.description }}</p>
              <span class="achievement-date">{{ formatDate(achievement.earnedDate) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Learning Insights -->
      <div class="insights-section">
        <h2 class="section-title">💡 Nhận Xét & Đề Xuất</h2>
        <div class="insights-grid">
          <div class="insight-card positive">
            <div class="insight-icon">🌟</div>
            <div class="insight-content">
              <h3>Điểm tích cực</h3>
              <p>Bé đã duy trì học đều đặn {{ weeklyStats().streak }} ngày liên tiếp. Thật tuyệt vời!</p>
            </div>
          </div>

          <div class="insight-card suggestion">
            <div class="insight-icon">💭</div>
            <div class="insight-content">
              <h3>Gợi ý</h3>
              <p>Thời gian học tốt nhất của bé là buổi sáng (8-10h). Hãy tận dụng khung giờ này!</p>
            </div>
          </div>

          <div class="insight-card goal">
            <div class="insight-icon">🎯</div>
            <div class="insight-content">
              <h3>Mục tiêu tuần sau</h3>
              <p>Hoàn thành thêm 3 bài học Toán để đạt mốc 20 bài trong tháng!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .learning-report-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    /* Header */
    .report-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      gap: 1rem;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .back-button {
      width: 48px;
      height: 48px;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .back-button:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateX(-4px);
    }

    .header-title h1 {
      font-size: 2rem;
      font-weight: 800;
      color: white;
      margin: 0;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .header-title p {
      font-size: 0.95rem;
      color: rgba(255, 255, 255, 0.9);
      margin: 0.25rem 0 0 0;
    }

    /* Time Range Selector */
    .time-range-selector {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 2rem;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      padding: 0.5rem;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .range-button {
      flex: 1;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 12px;
      background: transparent;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .range-button:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .range-button.active {
      background: white;
      color: #667eea;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    /* Section Title */
    .section-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      margin: 0 0 1.5rem 0;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    /* Overview Stats */
    .overview-section {
      margin-bottom: 2rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .stat-card {
      background: white;
      border-radius: 20px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #667eea, #764ba2);
    }

    .stat-card.time-card::before {
      background: linear-gradient(90deg, #f093fb, #f5576c);
    }

    .stat-card.lessons-card::before {
      background: linear-gradient(90deg, #4facfe, #00f2fe);
    }

    .stat-card.score-card::before {
      background: linear-gradient(90deg, #43e97b, #38f9d7);
    }

    .stat-card.streak-card::before {
      background: linear-gradient(90deg, #fa709a, #fee140);
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
    }

    .stat-icon {
      font-size: 2.5rem;
      line-height: 1;
    }

    .stat-content {
      flex: 1;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 800;
      color: #2d3748;
      line-height: 1;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #718096;
      margin-top: 0.25rem;
    }

    .stat-change {
      font-size: 0.875rem;
      font-weight: 600;
      margin-top: 0.5rem;
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      background: #e2e8f0;
      color: #4a5568;
    }

    .stat-change.positive {
      background: #c6f6d5;
      color: #22543d;
    }

    /* Chart Section */
    .chart-section {
      background: white;
      border-radius: 24px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }

    .chart-section .section-title {
      color: #2d3748;
      text-shadow: none;
    }

    .chart-container {
      margin-top: 1.5rem;
    }

    .chart-wrapper {
      display: flex;
      gap: 1rem;
      height: 300px;
    }

    .chart-y-axis {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 1rem 0;
      color: #a0aec0;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .chart-bars {
      flex: 1;
      display: flex;
      gap: 0.5rem;
      align-items: flex-end;
      padding: 1rem 0;
    }

    .bar-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .bar-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }

    .bar {
      width: 100%;
      max-width: 60px;
      background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
      border-radius: 8px 8px 0 0;
      position: relative;
      transition: all 0.3s ease;
      min-height: 4px;
    }

    .bar:hover {
      opacity: 0.8;
      transform: scaleY(1.05);
    }

    .bar.highlight {
      background: linear-gradient(180deg, #f093fb 0%, #f5576c 100%);
      box-shadow: 0 4px 12px rgba(240, 147, 251, 0.4);
    }

    .bar-value {
      position: absolute;
      top: -24px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.75rem;
      font-weight: 700;
      color: #2d3748;
      white-space: nowrap;
    }

    .bar-label {
      font-size: 0.75rem;
      color: #718096;
      font-weight: 600;
      text-align: center;
    }

    .chart-legend {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e2e8f0;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #4a5568;
    }

    .legend-color {
      width: 16px;
      height: 16px;
      border-radius: 4px;
    }

    .legend-color.primary {
      background: linear-gradient(135deg, #667eea, #764ba2);
    }

    /* Subjects Section */
    .subjects-section {
      margin-bottom: 2rem;
    }

    .subjects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .subject-card {
      background: white;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .subject-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
    }

    .subject-header {
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      position: relative;
    }

    .subject-icon {
      font-size: 2.5rem;
      line-height: 1;
    }

    .subject-info {
      flex: 1;
    }

    .subject-info h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: white;
      margin: 0;
    }

    .subject-info p {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.9);
      margin: 0.25rem 0 0 0;
    }

    .subject-trend {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .subject-trend.up {
      background: rgba(67, 233, 123, 0.2);
      color: #22543d;
    }

    .subject-trend.down {
      background: rgba(245, 87, 108, 0.2);
      color: #742a2a;
    }

    .subject-stats {
      display: flex;
      gap: 1.5rem;
      padding: 1rem 1.5rem;
      background: #f7fafc;
    }

    .subject-stat {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #4a5568;
      font-weight: 600;
    }

    .subject-progress {
      padding: 0 1.5rem 1rem 1.5rem;
    }

    .progress-bar {
      height: 8px;
      background: #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.6s ease;
    }

    .subject-details {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .detail-section h4 {
      font-size: 0.875rem;
      font-weight: 700;
      color: #2d3748;
      margin: 0 0 0.5rem 0;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tag {
      padding: 0.375rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .tag.strong {
      background: #c6f6d5;
      color: #22543d;
    }

    .tag.improve {
      background: #fed7d7;
      color: #742a2a;
    }

    /* Achievements Section */
    .achievements-section {
      margin-bottom: 2rem;
    }

    .achievements-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
    }

    .achievement-card {
      background: white;
      border-radius: 20px;
      padding: 1.5rem;
      display: flex;
      gap: 1rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      border: 2px solid transparent;
    }

    .achievement-card.streak { border-color: #fa709a; background: linear-gradient(to bottom right, #fff, #fff5f7); }
    .achievement-card.mastery { border-color: #667eea; background: linear-gradient(to bottom right, #fff, #f5f7ff); }
    .achievement-card.speed { border-color: #4facfe; background: linear-gradient(to bottom right, #fff, #f0f9ff); }
    .achievement-card.perfect { border-color: #43e97b; background: linear-gradient(to bottom right, #fff, #f6fff9); }

    .achievement-card:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
    }

    .achievement-icon {
      font-size: 2.5rem;
      line-height: 1;
    }

    .achievement-content h3 {
      font-size: 1rem;
      font-weight: 700;
      color: #2d3748;
      margin: 0 0 0.25rem 0;
    }

    .achievement-content p {
      font-size: 0.875rem;
      color: #718096;
      margin: 0 0 0.5rem 0;
    }

    .achievement-date {
      font-size: 0.75rem;
      color: #a0aec0;
      font-weight: 600;
    }

    /* Insights Section */
    .insights-section {
      margin-bottom: 2rem;
    }

    .insights-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .insight-card {
      background: white;
      border-radius: 20px;
      padding: 1.5rem;
      display: flex;
      gap: 1rem;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      border-left: 4px solid;
    }

    .insight-card.positive {
      border-left-color: #43e97b;
    }

    .insight-card.suggestion {
      border-left-color: #4facfe;
    }

    .insight-card.goal {
      border-left-color: #f093fb;
    }

    .insight-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
    }

    .insight-icon {
      font-size: 2rem;
      line-height: 1;
    }

    .insight-content h3 {
      font-size: 1rem;
      font-weight: 700;
      color: #2d3748;
      margin: 0 0 0.5rem 0;
    }

    .insight-content p {
      font-size: 0.875rem;
      color: #4a5568;
      margin: 0;
      line-height: 1.5;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .learning-report-container {
        padding: 1rem;
      }

      .report-header {
        flex-direction: column;
      }

      .header-title h1 {
        font-size: 1.5rem;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .subjects-grid {
        grid-template-columns: 1fr;
      }

      .chart-wrapper {
        height: 200px;
      }

      .bar-label {
        font-size: 0.65rem;
      }
    }
  `]
})
export class LearningReportComponent implements OnInit {
  selectedStudent;
  selectedTimeRange = signal<'week' | 'month' | 'year'>('week');

  timeRanges = [
    { value: 'week' as const, label: 'Tuần này' },
    { value: 'month' as const, label: 'Tháng này' },
    { value: 'year' as const, label: 'Năm nay' }
  ];

  // Mock data - In production, fetch from API
  weeklyStats = signal<WeeklyStats>({
    totalMinutes: 245,
    totalLessons: 18,
    averageScore: 87,
    streak: 7,
    improvement: 12
  });

  dailyActivities = signal<DailyActivity[]>([
    { date: new Date(2026, 0, 5), totalMinutes: 30, lessonsCompleted: 2, averageScore: 85 },
    { date: new Date(2026, 0, 6), totalMinutes: 45, lessonsCompleted: 3, averageScore: 90 },
    { date: new Date(2026, 0, 7), totalMinutes: 25, lessonsCompleted: 2, averageScore: 82 },
    { date: new Date(2026, 0, 8), totalMinutes: 40, lessonsCompleted: 3, averageScore: 88 },
    { date: new Date(2026, 0, 9), totalMinutes: 35, lessonsCompleted: 2, averageScore: 86 },
    { date: new Date(2026, 0, 10), totalMinutes: 50, lessonsCompleted: 4, averageScore: 92 },
    { date: new Date(2026, 0, 11), totalMinutes: 20, lessonsCompleted: 2, averageScore: 84 }
  ]);

  subjectReports = signal<SubjectReport[]>([
    {
      subject: 'Toán Học',
      icon: '🔢',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      totalTime: 120,
      lessonsCompleted: 8,
      averageScore: 88,
      strongAreas: ['Phép cộng', 'Đếm số'],
      improvementAreas: ['Phép trừ'],
      trend: 'up'
    },
    {
      subject: 'Tiếng Việt',
      icon: '📖',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      totalTime: 85,
      lessonsCompleted: 6,
      averageScore: 85,
      strongAreas: ['Nhận biết chữ cái', 'Đọc từ'],
      improvementAreas: ['Viết chữ'],
      trend: 'up'
    },
    {
      subject: 'Tiếng Anh',
      icon: '🌍',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      totalTime: 40,
      lessonsCompleted: 4,
      averageScore: 82,
      strongAreas: ['Từ vựng'],
      improvementAreas: ['Phát âm', 'Ngữ pháp'],
      trend: 'stable'
    }
  ]);

  recentAchievements = signal<Achievement[]>([
    {
      title: 'Học Liên Tục 7 Ngày',
      description: 'Duy trì học đều đặn cả tuần!',
      icon: '🔥',
      earnedDate: new Date(2026, 0, 11),
      category: 'streak'
    },
    {
      title: 'Bậc Thầy Phép Cộng',
      description: 'Hoàn thành 10 bài phép cộng với điểm cao',
      icon: '➕',
      earnedDate: new Date(2026, 0, 10),
      category: 'mastery'
    },
    {
      title: 'Tốc Độ Ánh Sáng',
      description: 'Hoàn thành bài học trong 5 phút',
      icon: '⚡',
      earnedDate: new Date(2026, 0, 9),
      category: 'speed'
    },
    {
      title: 'Điểm Tuyệt Đối',
      description: 'Đạt 100% trong bài kiểm tra',
      icon: '💯',
      earnedDate: new Date(2026, 0, 8),
      category: 'perfect'
    }
  ]);

  constructor(private studentSwitcherService: StudentSwitcherService) {
    this.selectedStudent = this.studentSwitcherService.selectedStudent;
  }

  ngOnInit(): void {
    this.loadReportData();
  }

  loadReportData(): void {
    // In production, fetch data from API based on selectedStudent and selectedTimeRange
    console.log('Loading report data for:', this.selectedStudent()?.name);
  }

  selectTimeRange(range: 'week' | 'month' | 'year'): void {
    this.selectedTimeRange.set(range);
    this.loadReportData();
  }

  getTimeRangeLabel(): string {
    const range = this.selectedTimeRange();
    return range === 'week' ? 'Tuần Này' : range === 'month' ? 'Tháng Này' : 'Năm Nay';
  }

  getBarHeight(minutes: number): number {
    const maxMinutes = 60;
    return (minutes / maxMinutes) * 100;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  formatDayLabel(date: Date): string {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return days[date.getDay()];
  }

  getAchievementBorderClass(category: string): string {
    return category;
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }

  goBack(): void {
    window.history.back();
  }
}
