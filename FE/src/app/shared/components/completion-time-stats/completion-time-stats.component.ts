import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearningService, CompletionTimeResponse } from '../../../core/services/learning.service';

@Component({
  selector: 'app-completion-time-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="completion-stats-container">
      <h2>📊 Thống Kê Thời Gian Hoàn Thành</h2>

      <div class="filter-section">
        <label>Chọn bài tập:</label>
        <select (change)="onLevelChange($event)" class="level-select">
          <option value="">Tất cả bài tập</option>
          <option value="counting">Đếm Số</option>
          <option value="simple-words">Từ Đơn Giản</option>
          <option value="addition">Phép Cộng</option>
          <option value="subtraction">Phép Trừ</option>
        </select>
      </div>

      @if (loading()) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      } @else if (error()) {
        <div class="error">
          <p>❌ {{ error() }}</p>
          <button (click)="loadData()" class="retry-btn">Thử lại</button>
        </div>
      } @else if (data()) {
        <div class="stats-content">
          @if (data()!.totalSessions === 0) {
            <div class="no-data">
              <p>📝 Chưa có dữ liệu hoàn thành bài tập</p>
            </div>
          } @else {
            <!-- Summary Cards -->
            <div class="summary-cards">
              <div class="stat-card total">
                <div class="icon">🎯</div>
                <div class="info">
                  <span class="label">Tổng số lần</span>
                  <span class="value">{{ data()!.totalSessions }}</span>
                </div>
              </div>

              <div class="stat-card average">
                <div class="icon">⏱️</div>
                <div class="info">
                  <span class="label">Thời gian TB</span>
                  <span class="value">{{ formatTime(data()!.averageTimeSeconds) }}</span>
                </div>
              </div>

              <div class="stat-card fastest">
                <div class="icon">🚀</div>
                <div class="info">
                  <span class="label">Nhanh nhất</span>
                  <span class="value">{{ formatTime(data()!.fastestTimeSeconds) }}</span>
                </div>
              </div>

              <div class="stat-card slowest">
                <div class="icon">🐢</div>
                <div class="info">
                  <span class="label">Chậm nhất</span>
                  <span class="value">{{ formatTime(data()!.slowestTimeSeconds) }}</span>
                </div>
              </div>

              <div class="stat-card total-time">
                <div class="icon">📚</div>
                <div class="info">
                  <span class="label">Tổng thời gian</span>
                  <span class="value">{{ formatTotalTime(data()!.totalTimeSeconds) }}</span>
                </div>
              </div>
            </div>

            <!-- Recent Sessions -->
            <div class="recent-sessions">
              <h3>📜 Lịch Sử Gần Nhất</h3>
              <div class="sessions-list">
                @for (session of data()!.recentSessions; track session.sessionId) {
                  <div class="session-item" [class.high-score]="session.stars === 3">
                    <div class="session-header">
                      <span class="level-name">{{ session.levelName }}</span>
                      <span class="stars">{{ getStarDisplay(session.stars) }}</span>
                    </div>
                    <div class="session-details">
                      <div class="detail">
                        <span class="icon">⏱️</span>
                        <span>{{ formatTime(session.durationSeconds) }}</span>
                      </div>
                      <div class="detail">
                        <span class="icon">📝</span>
                        <span>{{ session.score }}/{{ session.totalQuestions }}</span>
                      </div>
                      <div class="detail">
                        <span class="icon">🎯</span>
                        <span>{{ session.accuracyPercentage.toFixed(0) }}%</span>
                      </div>
                      <div class="detail">
                        <span class="icon">📅</span>
                        <span>{{ formatDate(session.completedAt) }}</span>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .completion-stats-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      font-family: 'Inter', sans-serif;
    }

    h2 {
      font-size: 2rem;
      font-weight: 700;
      color: #1a1a2e;
      margin-bottom: 2rem;
      text-align: center;
    }

    .filter-section {
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      justify-content: center;
    }

    .filter-section label {
      font-weight: 600;
      color: #4a5568;
    }

    .level-select {
      padding: 0.75rem 1.5rem;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 1rem;
      background: white;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .level-select:hover {
      border-color: #667eea;
    }

    .level-select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .loading, .error, .no-data {
      text-align: center;
      padding: 3rem;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f4f6;
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error p {
      color: #e53e3e;
      font-size: 1.1rem;
      margin-bottom: 1rem;
    }

    .retry-btn {
      padding: 0.75rem 2rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .retry-btn:hover {
      background: #5568d3;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      color: white;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .stat-card.average {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .stat-card.fastest {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .stat-card.slowest {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }

    .stat-card.total-time {
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    }

    .stat-card .icon {
      font-size: 2.5rem;
    }

    .stat-card .info {
      display: flex;
      flex-direction: column;
    }

    .stat-card .label {
      font-size: 0.875rem;
      opacity: 0.9;
      font-weight: 500;
    }

    .stat-card .value {
      font-size: 1.5rem;
      font-weight: 700;
      margin-top: 0.25rem;
    }

    .recent-sessions h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 1.5rem;
    }

    .sessions-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .session-item {
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.5rem;
      transition: all 0.3s ease;
    }

    .session-item:hover {
      border-color: #667eea;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
      transform: translateX(4px);
    }

    .session-item.high-score {
      border-color: #f6ad55;
      background: linear-gradient(to right, #fff5f0 0%, white 100%);
    }

    .session-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .level-name {
      font-weight: 600;
      font-size: 1.1rem;
      color: #2d3748;
    }

    .stars {
      font-size: 1.2rem;
    }

    .session-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .detail {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #4a5568;
      font-size: 0.95rem;
    }

    .detail .icon {
      font-size: 1.1rem;
    }

    .no-data {
      background: #f7fafc;
      border: 2px dashed #cbd5e0;
      border-radius: 12px;
      padding: 3rem;
      color: #718096;
      font-size: 1.1rem;
    }
  `]
})
export class CompletionTimeStatsComponent implements OnInit {
  private learningService = inject(LearningService);

  data = signal<CompletionTimeResponse | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  currentLevelId = signal<string | undefined>(undefined);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    this.error.set(null);

    this.learningService.getCompletionTime(this.currentLevelId()).subscribe({
      next: (response: CompletionTimeResponse) => {
        this.data.set(response);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.error.set('Không thể tải dữ liệu. Vui lòng thử lại.');
        this.loading.set(false);
        console.error('Error loading completion time:', err);
      }
    });
  }

  onLevelChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const levelId = select.value || undefined;
    this.currentLevelId.set(levelId);
    this.loadData();
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes}p ${remainingSeconds}s`;
    }
    return `${seconds}s`;
  }

  formatTotalTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}p`;
    }
    return `${minutes}p`;
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  getStarDisplay(stars: number): string {
    return '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
  }
}
