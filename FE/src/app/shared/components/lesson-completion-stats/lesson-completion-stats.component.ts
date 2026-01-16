import { Component, Input, Output, EventEmitter, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearningService, CompletionTimeResponse } from '../../../core/services/learning.service';
import { LessonTimerService } from '../../../core/services/lesson-timer.service';

@Component({
    selector: 'app-lesson-completion-stats',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="completion-overlay" (click)="onClose()">
      <div class="completion-modal" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="onClose()">✕</button>

        <div class="modal-header">
          <div class="trophy-icon">🏆</div>
          <h2>Hoàn Thành Bài Học!</h2>
        </div>

        <div class="current-time-section">
          <div class="time-label">Thời gian lần này</div>
          <div class="current-time">
            <span class="icon">⏱️</span>
            <span class="time">{{ formatTime(currentDuration) }}</span>
          </div>
        </div>

        @if (loading()) {
          <div class="loading-stats">
            <div class="spinner"></div>
            <p>Đang tải thống kê...</p>
          </div>
        } @else if (stats()) {
          <div class="stats-section">
            <h3>📊 So Sánh Với Lần Trước</h3>

            <div class="comparison-grid">
              <div class="stat-card">
                <div class="stat-icon">📈</div>
                <div class="stat-info">
                  <span class="stat-label">Trung bình</span>
                  <span class="stat-value">{{ formatTime(stats()!.averageTimeSeconds) }}</span>
                </div>
                @if (getDifference('average') !== null) {
                  <div class="stat-badge" [class.faster]="getDifference('average')! < 0" [class.slower]="getDifference('average')! > 0">
                    {{ getDifference('average')! > 0 ? '+' : '' }}{{ formatTime(absValue(getDifference('average')!)) }}
                  </div>
                }
              </div>

              <div class="stat-card">
                <div class="stat-icon">🚀</div>
                <div class="stat-info">
                  <span class="stat-label">Nhanh nhất</span>
                  <span class="stat-value">{{ formatTime(stats()!.fastestTimeSeconds) }}</span>
                </div>
                @if (currentDuration === stats()!.fastestTimeSeconds) {
                  <div class="stat-badge new-record">Kỷ lục mới! 🎉</div>
                }
              </div>

              <div class="stat-card">
                <div class="stat-icon">🎯</div>
                <div class="stat-info">
                  <span class="stat-label">Tổng số lần</span>
                  <span class="stat-value">{{ stats()!.totalSessions }}</span>
                </div>
              </div>
            </div>

            @if (getPerformanceMessage()) {
              <div class="performance-message" [class]="getPerformanceClass()">
                <span class="message-icon">{{ getPerformanceIcon() }}</span>
                <span class="message-text">{{ getPerformanceMessage() }}</span>
              </div>
            }
          </div>
        }

        <div class="action-buttons">
          <button class="btn btn-primary" (click)="onClose()">
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .completion-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .completion-modal {
      background: white;
      border-radius: 24px;
      padding: 2rem;
      max-width: 600px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;
    }

    @keyframes slideUp {
      from {
        transform: translateY(50px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .close-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: #f3f4f6;
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1.25rem;
      color: #6b7280;
      transition: all 0.2s ease;
    }

    .close-btn:hover {
      background: #e5e7eb;
      transform: rotate(90deg);
    }

    .modal-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .trophy-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      animation: bounce 1s ease-in-out;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }

    .modal-header h2 {
      font-size: 2rem;
      font-weight: 700;
      color: #1a1a2e;
      margin: 0;
    }

    .current-time-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      padding: 1.5rem;
      text-align: center;
      margin-bottom: 2rem;
      color: white;
    }

    .time-label {
      font-size: 0.875rem;
      opacity: 0.9;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .current-time {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      font-size: 2.5rem;
      font-weight: 700;
    }

    .current-time .icon {
      font-size: 2rem;
    }

    .loading-stats {
      text-align: center;
      padding: 2rem;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f4f6;
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .stats-section h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .comparison-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .stat-card {
      background: #f7fafc;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      padding: 1rem;
      text-align: center;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      border-color: #667eea;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
    }

    .stat-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .stat-label {
      font-size: 0.75rem;
      color: #718096;
      font-weight: 500;
    }

    .stat-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: #2d3748;
    }

    .stat-badge {
      margin-top: 0.5rem;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      display: inline-block;
    }

    .stat-badge.faster {
      background: #c6f6d5;
      color: #22543d;
    }

    .stat-badge.slower {
      background: #fed7d7;
      color: #742a2a;
    }

    .stat-badge.new-record {
      background: linear-gradient(135deg, #f6ad55 0%, #ed8936 100%);
      color: white;
      animation: pulse-glow 1.5s ease-in-out infinite;
    }

    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 0 0 rgba(246, 173, 85, 0.7); }
      50% { box-shadow: 0 0 0 10px rgba(246, 173, 85, 0); }
    }

    .performance-message {
      background: #edf2f7;
      border-left: 4px solid #667eea;
      padding: 1rem 1.25rem;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }

    .performance-message.excellent {
      background: #c6f6d5;
      border-left-color: #38a169;
    }

    .performance-message.good {
      background: #bee3f8;
      border-left-color: #3182ce;
    }

    .performance-message.average {
      background: #feebc8;
      border-left-color: #dd6b20;
    }

    .message-icon {
      font-size: 1.5rem;
    }

    .message-text {
      font-size: 0.95rem;
      font-weight: 500;
      color: #2d3748;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      justify-content: center;
    }

    .btn {
      padding: 0.875rem 2rem;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
    }

    .btn-primary:active {
      transform: translateY(0);
    }

    /* Scrollbar */
    .completion-modal::-webkit-scrollbar {
      width: 8px;
    }

    .completion-modal::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }

    .completion-modal::-webkit-scrollbar-thumb {
      background: #667eea;
      border-radius: 10px;
    }

    .completion-modal::-webkit-scrollbar-thumb:hover {
      background: #5568d3;
    }
  `]
})
export class LessonCompletionStatsComponent implements OnInit {
    @Input() levelId!: string;
    @Input() currentDuration!: number; // in seconds
    @Output() close = new EventEmitter<void>();

    private learningService = inject(LearningService);
    private timerService = inject(LessonTimerService);

    stats = signal<CompletionTimeResponse | null>(null);
    loading = signal(true);

    ngOnInit() {
        this.loadStats();
    }

    loadStats() {
        this.learningService.getCompletionTime(this.levelId).subscribe({
            next: (data) => {
                this.stats.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading completion stats:', err);
                this.loading.set(false);
            }
        });
    }

    onClose() {
        this.close.emit();
    }

    formatTime(seconds: number): string {
        return this.timerService.formatTimeHuman(seconds);
    }

    getDifference(type: 'average' | 'fastest'): number | null {
        const statsData = this.stats();
        if (!statsData || statsData.totalSessions <= 1) return null;

        if (type === 'average') {
            return this.currentDuration - statsData.averageTimeSeconds;
        } else {
            return this.currentDuration - statsData.fastestTimeSeconds;
        }
    }

    getPerformanceMessage(): string | null {
        const statsData = this.stats();
        if (!statsData || statsData.totalSessions <= 1) return null;

        const diff = this.getDifference('average');
        if (diff === null) return null;

        if (this.currentDuration === statsData.fastestTimeSeconds) {
            return 'Tuyệt vời! Bé đã lập kỷ lục mới! 🎉';
        } else if (diff < -30) {
            return 'Xuất sắc! Bé làm nhanh hơn trung bình rất nhiều! 🌟';
        } else if (diff < 0) {
            return 'Tốt lắm! Bé làm nhanh hơn lần trước! 👍';
        } else if (diff < 30) {
            return 'Bé đang làm ổn định! Tiếp tục cố gắng nhé! 💪';
        } else {
            return 'Bé hãy cố gắng làm nhanh hơn lần sau nhé! 🚀';
        }
    }

    getPerformanceClass(): string {
        const diff = this.getDifference('average');
        if (diff === null) return '';

        if (diff < -30) return 'excellent';
        if (diff < 0) return 'good';
        return 'average';
    }

    getPerformanceIcon(): string {
        const diff = this.getDifference('average');
        if (diff === null) return '📊';

        if (diff < -30) return '🌟';
        if (diff < 0) return '👍';
        return '💪';
    }

    absValue(num: number): number {
        return Math.abs(num);
    }
}
