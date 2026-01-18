import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentSwitcherComponent } from '../../shared/components/student-switcher.component';
import { StudentSwitcherService } from '../../core/services/student-switcher.service';
import { DashboardService, DailyActivitiesResponse } from '../../core/services/dashboard.service';
import { Router } from '@angular/router';

interface WeeklyStats {
  totalMinutes: number;
  totalLessons: number;
  averageScore: number;
  streak: number;
  improvement: number;
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
  imports: [CommonModule, FormsModule],
  template: `
    <div class="report-container">

      <!-- Header -->
      <div class="report-header">
        <div class="header-content">
          <div class="header-icon">📊</div>
          <div class="header-text">
            <h1 class="header-title">Báo Cáo Học Tập</h1>
            <p class="header-subtitle">Theo dõi chi tiết tiến độ và thành tích của bé</p>
          </div>
        </div>
      </div>

      <!-- Time Range Tabs -->
      <div class="time-tabs">
        @for (range of timeRanges; track range.value) {
          <button
            [class.active]="selectedTimeRange() === range.value"
            (click)="selectTimeRange(range.value)"
            class="time-tab">
            <span class="tab-icon">{{ range.icon }}</span>
            <span class="tab-label">{{ range.label }}</span>
          </button>
        }
      </div>

      <!-- Activity Chart -->
      <div class="chart-section">
        <div class="section-header">
          <h2 class="section-title">
            <span class="title-icon">📈</span>
            Hoạt Động Hàng Ngày
          </h2>
          <div class="section-subtitle">Thời gian học mỗi ngày trong tuần</div>
        </div>

        <div class="chart-container">
          <div class="chart-y-labels">
            <span>60</span>
            <span>45</span>
            <span>30</span>
            <span>15</span>
            <span>0</span>
          </div>

          <div class="chart-content">
            <div class="chart-grid">
              <div class="grid-line"></div>
              <div class="grid-line"></div>
              <div class="grid-line"></div>
              <div class="grid-line"></div>
              <div class="grid-line"></div>
            </div>

            <div class="chart-bars">
              @for (day of dailyActivities(); track day.date) {
                <div class="bar-group">
                  <div class="bar-container">
                    <div
                      class="bar"
                      [class.today]="isToday(day.date)"
                      [style.height.%]="getBarHeight(day.totalMinutes)">
                      <div class="bar-tooltip">
                        <div class="tooltip-value">{{ day.totalMinutes }} phút</div>
                        <div class="tooltip-lessons">{{ day.lessonsCompleted }} bài</div>
                        <div class="tooltip-score">{{ day.averageScore }}% điểm</div>
                      </div>
                    </div>
                  </div>
                  <div class="bar-label">{{ formatDayLabel(day.date) }}</div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Subject Performance -->
      <div class="subjects-section">
        <div class="section-header">
          <h2 class="section-title">
            <span class="title-icon">🎯</span>
            Thành Tích Theo Môn Học
          </h2>
          <div class="section-subtitle">Phân tích chi tiết từng môn</div>
        </div>

        <div class="subjects-grid">
          @for (subject of subjectReports(); track subject.subject) {
            <div class="subject-card">
              <div class="subject-header" [style.background]="subject.color">
                <div class="subject-icon">{{ subject.icon }}</div>
                <div class="subject-info">
                  <h3 class="subject-name">{{ subject.subject }}</h3>
                  <p class="subject-lessons">{{ subject.lessonsCompleted }} bài hoàn thành</p>
                </div>
                <div class="subject-trend" [class]="subject.trend">
                  @if (subject.trend === 'up') {
                    <span class="trend-arrow">↗</span>
                  }
                  @if (subject.trend === 'down') {
                    <span class="trend-arrow">↘</span>
                  }
                  @if (subject.trend === 'stable') {
                    <span class="trend-arrow">→</span>
                  }
                </div>
              </div>

              <div class="subject-body">
                <div class="subject-stats-row">
                  <div class="subject-stat">
                    <span class="stat-icon">⏱️</span>
                    <span class="stat-value">{{ subject.totalTime }} phút</span>
                  </div>
                  <div class="subject-stat">
                    <span class="stat-icon">⭐</span>
                    <span class="stat-value">{{ subject.averageScore }}%</span>
                  </div>
                </div>

                <div class="subject-progress-bar">
                  <div class="progress-track">
                    <div
                      class="progress-fill"
                      [style.width.%]="subject.averageScore"
                      [style.background]="subject.color">
                    </div>
                  </div>
                  <span class="progress-label">{{ subject.averageScore }}%</span>
                </div>

                @if (subject.strongAreas.length > 0) {
                  <div class="subject-areas">
                    <h4 class="areas-title">
                      <span class="areas-icon">💪</span>
                      Điểm mạnh
                    </h4>
                    <div class="areas-tags">
                      @for (area of subject.strongAreas; track area) {
                        <span class="area-tag strong">{{ area }}</span>
                      }
                    </div>
                  </div>
                }

                @if (subject.improvementAreas.length > 0) {
                  <div class="subject-areas">
                    <h4 class="areas-title">
                      <span class="areas-icon">📈</span>
                      Cần cải thiện
                    </h4>
                    <div class="areas-tags">
                      @for (area of subject.improvementAreas; track area) {
                        <span class="area-tag improve">{{ area }}</span>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Insights -->
      <div class="insights-section">
        <div class="section-header">
          <h2 class="section-title">
            <span class="title-icon">💡</span>
            Nhận Xét & Đề Xuất
          </h2>
          <div class="section-subtitle">Gợi ý để bé học tốt hơn</div>
        </div>

        <div class="insights-grid">
          <div class="insight-card positive">
            <div class="insight-icon">🌟</div>
            <div class="insight-content">
              <h3 class="insight-title">Điểm tích cực</h3>
              <p class="insight-text">Bé đã duy trì học đều đặn {{ weeklyStats().streak }} ngày liên tiếp. Thật tuyệt vời! Hãy tiếp tục phát huy nhé!</p>
            </div>
          </div>

          <div class="insight-card suggestion">
            <div class="insight-icon">💭</div>
            <div class="insight-content">
              <h3 class="insight-title">Gợi ý cải thiện</h3>
              <p class="insight-text">Thời gian học tốt nhất của bé là buổi sáng (8-10h). Hãy tận dụng khung giờ vàng này để đạt hiệu quả cao nhất!</p>
            </div>
          </div>

          <div class="insight-card goal">
            <div class="insight-icon">🎯</div>
            <div class="insight-content">
              <h3 class="insight-title">Mục tiêu tuần sau</h3>
              <p class="insight-text">Hoàn thành thêm 3 bài học Toán để đạt mốc 20 bài trong tháng! Bé đã rất gần với mục tiêu rồi đấy!</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Background Decorations -->
      <div class="bg-decoration bg-decoration-1"></div>
      <div class="bg-decoration bg-decoration-2"></div>
      <div class="bg-decoration bg-decoration-3"></div>

    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .report-container {
      min-height: calc(100vh - 80px);
      background: linear-gradient(to bottom, #87CEEB 0%, #4A90E2 100%);
      padding: 2rem;
      position: relative;
      overflow: hidden;
    }

    /* Background Decorations */
    .bg-decoration {
      position: fixed;
      border-radius: 50%;
      opacity: 0.15;
      pointer-events: none;
      z-index: 0;
    }

    .bg-decoration-1 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, #fff 0%, transparent 70%);
      top: -100px;
      right: -100px;
      animation: float 20s ease-in-out infinite;
    }

    .bg-decoration-2 {
      width: 350px;
      height: 350px;
      background: radial-gradient(circle, #fff 0%, transparent 70%);
      bottom: -80px;
      left: -80px;
      animation: float 25s ease-in-out infinite reverse;
    }

    .bg-decoration-3 {
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, #fff 0%, transparent 70%);
      top: 40%;
      left: 60%;
      animation: pulse 18s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      25% { transform: translate(20px, -20px) rotate(45deg); }
      50% { transform: translate(0, -40px) rotate(90deg); }
      75% { transform: translate(-20px, -20px) rotate(135deg); }
    }

    @keyframes pulse {
      0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.15; }
      50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.2; }
    }

    /* Header */
    .report-header {
      position: relative;
      z-index: 1;
      margin-bottom: 2rem;
    }

    .back-btn {
      background: rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(10px);
      border: 2px solid rgba(255, 255, 255, 0.4);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
      margin-bottom: 1.5rem;
    }

    .back-btn:hover {
      background: rgba(255, 255, 255, 0.35);
      transform: translateX(-5px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }

    .back-icon {
      font-size: 1.5rem;
      transition: transform 0.3s ease;
    }

    .back-btn:hover .back-icon {
      transform: translateX(-3px);
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 1rem;
    }

    .header-icon {
      font-size: 4rem;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
      animation: bounce 2s ease-in-out infinite;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .header-text {
      color: white;
    }

    .header-title {
      font-size: 2.5rem;
      font-weight: 800;
      margin: 0;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    }

    .header-subtitle {
      font-size: 1.1rem;
      margin: 0.5rem 0 0 0;
      opacity: 0.95;
    }

    .student-switcher-wrapper {
      margin-top: 1rem;
    }

    /* Time Tabs */
    .time-tabs {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      padding: 0.5rem;
      border-radius: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      position: relative;
      z-index: 1;
    }

    .time-tab {
      flex: 1;
      padding: 1rem 1.5rem;
      border: none;
      border-radius: 16px;
      background: transparent;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .time-tab:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .time-tab.active {
      background: white;
      color: #667eea;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .tab-icon {
      font-size: 1.2rem;
    }

    /* Stats Section */
    .stats-section {
      margin-bottom: 2rem;
      position: relative;
      z-index: 1;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(10px);
      border-radius: 24px;
      padding: 2rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      border: 3px solid rgba(255, 255, 255, 0.5);
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
    }

    .stat-card.stat-time::before {
      background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
    }

    .stat-card.stat-lessons::before {
      background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
    }

    .stat-card.stat-score::before {
      background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
    }

    .stat-card.stat-streak::before {
      background: linear-gradient(90deg, #fa709a 0%, #fee140 100%);
    }

    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
    }

    .stat-icon-wrapper {
      width: 70px;
      height: 70px;
      border-radius: 20px;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-icon {
      font-size: 2.5rem;
    }

    .stat-content {
      flex: 1;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: 800;
      color: #2d3748;
      line-height: 1;
    }

    .stat-label {
      font-size: 0.9rem;
      color: #718096;
      margin-top: 0.5rem;
      font-weight: 600;
    }

    .stat-trend {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      margin-top: 0.75rem;
      padding: 0.4rem 0.8rem;
      border-radius: 50px;
      font-size: 0.85rem;
      font-weight: 700;
      background: #e2e8f0;
      color: #4a5568;
    }

    .stat-trend.positive {
      background: #c6f6d5;
      color: #22543d;
    }

    .trend-icon {
      font-size: 1rem;
    }

    /* Section Header */
    .section-header {
      margin-bottom: 1.5rem;
    }

    .section-title {
      font-size: 1.8rem;
      font-weight: 800;
      color: white;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    }

    .title-icon {
      font-size: 2rem;
    }

    .section-subtitle {
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.9);
      margin-top: 0.5rem;
      font-weight: 600;
    }

    /* Chart Section */
    .chart-section {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(10px);
      border-radius: 24px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      border: 3px solid rgba(255, 255, 255, 0.5);
      position: relative;
      z-index: 1;
    }

    .chart-section .section-title {
      color: #2d3748;
      text-shadow: none;
    }

    .chart-section .section-subtitle {
      color: #718096;
    }

    .chart-container {
      display: flex;
      gap: 1.5rem;
      margin-top: 2rem;
      height: 320px;
    }

    .chart-y-labels {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 1rem 0;
      color: #a0aec0;
      font-size: 0.875rem;
      font-weight: 700;
    }

    .chart-content {
      flex: 1;
      position: relative;
    }

    .chart-grid {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 40px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 1rem 0;
    }

    .grid-line {
      height: 1px;
      background: #e2e8f0;
    }

    .chart-bars {
      position: relative;
      height: 100%;
      display: flex;
      gap: 1rem;
      align-items: flex-end;
      padding: 1rem 0 40px 0;
    }

    .bar-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }

    .bar-container {
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
      border-radius: 12px 12px 0 0;
      position: relative;
      transition: all 0.3s ease;
      min-height: 8px;
      cursor: pointer;
    }

    .bar:hover {
      transform: scaleY(1.05);
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
    }

    .bar.today {
      background: linear-gradient(180deg, #f093fb 0%, #f5576c 100%);
      box-shadow: 0 4px 20px rgba(240, 147, 251, 0.5);
    }

    .bar-tooltip {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(-10px);
      background: #2d3748;
      color: white;
      padding: 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s ease;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    }

    .bar:hover .bar-tooltip {
      opacity: 1;
      transform: translateX(-50%) translateY(-5px);
    }

    .tooltip-value {
      font-weight: 800;
      font-size: 0.9rem;
      margin-bottom: 0.25rem;
    }

    .tooltip-lessons,
    .tooltip-score {
      font-size: 0.7rem;
      opacity: 0.9;
    }

    .bar-label {
      font-size: 0.85rem;
      color: #718096;
      font-weight: 700;
    }

    /* Subjects Section */
    .subjects-section {
      margin-bottom: 2rem;
      position: relative;
      z-index: 1;
    }

    .subjects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
      gap: 1.5rem;
    }

    .subject-card {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(10px);
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      border: 3px solid rgba(255, 255, 255, 0.5);
      transition: all 0.3s ease;
    }

    .subject-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
    }

    .subject-header {
      padding: 2rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      position: relative;
    }

    .subject-icon {
      font-size: 3rem;
      filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.1));
    }

    .subject-info {
      flex: 1;
    }

    .subject-name {
      font-size: 1.5rem;
      font-weight: 800;
      color: white;
      margin: 0;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
    }

    .subject-lessons {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.95);
      margin: 0.5rem 0 0 0;
      font-weight: 600;
    }

    .subject-trend {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
      font-weight: 800;
    }

    .subject-trend.up {
      background: rgba(67, 233, 123, 0.3);
    }

    .subject-trend.down {
      background: rgba(245, 87, 108, 0.3);
    }

    .subject-body {
      padding: 2rem;
    }

    .subject-stats-row {
      display: flex;
      gap: 2rem;
      margin-bottom: 1.5rem;
    }

    .subject-stat {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1rem;
      color: #4a5568;
      font-weight: 700;
    }

    .subject-progress-bar {
      margin-bottom: 2rem;
    }

    .progress-track {
      height: 12px;
      background: #e2e8f0;
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .progress-fill {
      height: 100%;
      border-radius: 6px;
      transition: width 1s ease;
    }

    .progress-label {
      font-size: 0.85rem;
      color: #718096;
      font-weight: 700;
    }

    .subject-areas {
      margin-bottom: 1.5rem;
    }

    .subject-areas:last-child {
      margin-bottom: 0;
    }

    .areas-title {
      font-size: 0.9rem;
      font-weight: 800;
      color: #2d3748;
      margin: 0 0 0.75rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .areas-icon {
      font-size: 1.1rem;
    }

    .areas-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .area-tag {
      padding: 0.5rem 1rem;
      border-radius: 50px;
      font-size: 0.85rem;
      font-weight: 700;
    }

    .area-tag.strong {
      background: #c6f6d5;
      color: #22543d;
    }

    .area-tag.improve {
      background: #fed7d7;
      color: #742a2a;
    }

    /* Achievements Section */
    .achievements-section {
      margin-bottom: 2rem;
      position: relative;
      z-index: 1;
    }

    .achievements-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .achievement-card {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(10px);
      border-radius: 24px;
      padding: 2rem;
      display: flex;
      gap: 1.5rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      border: 3px solid;
      transition: all 0.3s ease;
    }

    .achievement-card.streak {
      border-color: #fa709a;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 112, 154, 0.1) 100%);
    }

    .achievement-card.mastery {
      border-color: #667eea;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(102, 126, 234, 0.1) 100%);
    }

    .achievement-card.speed {
      border-color: #4facfe;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(79, 172, 254, 0.1) 100%);
    }

    .achievement-card.perfect {
      border-color: #43e97b;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(67, 233, 123, 0.1) 100%);
    }

    .achievement-card:hover {
      transform: translateY(-5px) scale(1.02);
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
    }

    .achievement-icon-wrapper {
      width: 70px;
      height: 70px;
      border-radius: 20px;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .achievement-icon {
      font-size: 2.5rem;
    }

    .achievement-content {
      flex: 1;
    }

    .achievement-title {
      font-size: 1.1rem;
      font-weight: 800;
      color: #2d3748;
      margin: 0 0 0.5rem 0;
    }

    .achievement-description {
      font-size: 0.9rem;
      color: #718096;
      margin: 0 0 0.75rem 0;
      line-height: 1.5;
    }

    .achievement-date {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: #a0aec0;
      font-weight: 700;
    }

    .date-icon {
      font-size: 1rem;
    }

    /* Insights Section */
    .insights-section {
      margin-bottom: 2rem;
      position: relative;
      z-index: 1;
    }

    .insights-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .insight-card {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(10px);
      border-radius: 24px;
      padding: 2rem;
      display: flex;
      gap: 1.5rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      border-left: 6px solid;
      transition: all 0.3s ease;
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
      transform: translateY(-5px);
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
    }

    .insight-icon {
      font-size: 2.5rem;
      flex-shrink: 0;
    }

    .insight-content {
      flex: 1;
    }

    .insight-title {
      font-size: 1.1rem;
      font-weight: 800;
      color: #2d3748;
      margin: 0 0 0.75rem 0;
    }

    .insight-text {
      font-size: 0.95rem;
      color: #4a5568;
      margin: 0;
      line-height: 1.6;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .subjects-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .report-container {
        padding: 1rem;
      }

      .header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .header-icon {
        font-size: 3rem;
      }

      .header-title {
        font-size: 2rem;
      }

      .time-tabs {
        flex-direction: column;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .chart-container {
        height: 250px;
      }

      .subjects-grid,
      .achievements-grid,
      .insights-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class LearningReportComponent implements OnInit {
  selectedStudent;
  selectedTimeRange = signal<'week' | 'month' | 'year'>('week');

  timeRanges = [
    { value: 'week' as const, label: 'Tuần này', icon: '📅' },
    { value: 'month' as const, label: 'Tháng này', icon: '📆' },
    { value: 'year' as const, label: 'Năm nay', icon: '🗓️' }
  ];

  weeklyStats = signal<WeeklyStats>({
    totalMinutes: 0,
    totalLessons: 0,
    averageScore: 0,
    streak: 0,
    improvement: 0
  });

  dailyActivities = signal<DailyActivity[]>([]);
  isLoading = signal<boolean>(false);

  subjectReports = signal<SubjectReport[]>([]);

  recentAchievements = signal<Achievement[]>([
    {
      title: 'Học Liên Tục 7 Ngày',
      description: 'Duy trì học đều đặn cả tuần! Thật tuyệt vời!',
      icon: '🔥',
      earnedDate: new Date(2026, 0, 17),
      category: 'streak'
    },
    {
      title: 'Bậc Thầy Phép Cộng',
      description: 'Hoàn thành 10 bài phép cộng với điểm cao',
      icon: '➕',
      earnedDate: new Date(2026, 0, 16),
      category: 'mastery'
    },
    {
      title: 'Tốc Độ Ánh Sáng',
      description: 'Hoàn thành bài học trong 5 phút',
      icon: '⚡',
      earnedDate: new Date(2026, 0, 15),
      category: 'speed'
    },
    {
      title: 'Điểm Tuyệt Đối',
      description: 'Đạt 100% trong bài kiểm tra',
      icon: '💯',
      earnedDate: new Date(2026, 0, 14),
      category: 'perfect'
    }
  ]);

  private dashboardService = inject(DashboardService);

  constructor(
    private studentSwitcherService: StudentSwitcherService,
    private router: Router
  ) {
    this.selectedStudent = this.studentSwitcherService.selectedStudent;
  }

  ngOnInit(): void {
    this.loadReportData();

    // Listen for student changes to reload data
    window.addEventListener('studentChanged', () => {
      this.loadReportData();
    });
  }

  async loadReportData(): Promise<void> {
    const student = this.selectedStudent();
    if (!student) {
      console.log('No student selected');
      return;
    }

    this.isLoading.set(true);
    console.log('Loading report data for:', student.name, 'Time range:', this.selectedTimeRange());

    try {
      // Fetch daily activities from API
      const response = await this.dashboardService.getDailyActivities(
        student.id,
        this.selectedTimeRange()
      );

      // Map API response to component format
      const activities: DailyActivity[] = response.activities.map(a => ({
        date: new Date(a.date),
        totalMinutes: a.totalMinutes,
        lessonsCompleted: a.lessonsCompleted,
        averageScore: a.averageScore
      }));

      this.dailyActivities.set(activities);

      // Update weekly stats from summary
      this.weeklyStats.set({
        totalMinutes: response.summary.totalMinutes,
        totalLessons: response.summary.totalLessons,
        averageScore: response.summary.averageScore,
        streak: response.summary.streak,
        improvement: response.summary.improvement
      });

      // Also fetch subject achievements for the subject reports section
      await this.loadSubjectReports(student.id);

    } catch (error) {
      console.error('Failed to load report data:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadSubjectReports(studentId: string): Promise<void> {
    try {
      const response = await this.dashboardService.getSubjectAchievements(studentId);

      const reports: SubjectReport[] = response.subjectAchievements.map(sa => ({
        subject: sa.subjectName,
        icon: sa.icon,
        color: sa.colors.headerGradient,
        totalTime: sa.totalTimeMinutes,
        lessonsCompleted: sa.completedLessons,
        averageScore: sa.avgScore,
        strongAreas: sa.strengths,
        improvementAreas: sa.needsImprovement,
        trend: sa.avgScore >= 80 ? 'up' : sa.avgScore >= 60 ? 'stable' : 'down' as 'up' | 'stable' | 'down'
      }));

      this.subjectReports.set(reports);
    } catch (error) {
      console.error('Failed to load subject reports:', error);
    }
  }

  selectTimeRange(range: 'week' | 'month' | 'year'): void {
    this.selectedTimeRange.set(range);
    this.loadReportData();
  }

  getBarHeight(minutes: number): number {
    // Calculate max based on current data for better visualization
    const activities = this.dailyActivities();
    const maxMinutes = activities.length > 0
      ? Math.max(60, ...activities.map(a => a.totalMinutes))
      : 60;
    return Math.min((minutes / maxMinutes) * 100, 100);
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  formatDayLabel(date: Date): string {
    const timeRange = this.selectedTimeRange();

    if (timeRange === 'year') {
      // For yearly view, show month name
      const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
      return months[date.getMonth()];
    } else if (timeRange === 'month') {
      // For monthly view, show day number
      return date.getDate().toString();
    } else {
      // For weekly view, show day of week
      const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      return days[date.getDay()];
    }
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }

  goBack(): void {
    this.router.navigate(['/parents']);
  }
}
