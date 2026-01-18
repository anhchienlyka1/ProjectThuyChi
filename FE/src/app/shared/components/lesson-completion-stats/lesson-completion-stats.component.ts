import { Component, Input, Output, EventEmitter, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearningService, CompletionTimeResponse } from '../../../core/services/learning.service';
import { LessonTimerService } from '../../../core/services/lesson-timer.service';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-lesson-completion-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="completion-overlay" (click)="onClose()">
      <div class="completion-modal" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="onClose()">✕</button>

        <!-- New Record Header -->
        <div class="modal-header">
          <div class="trophy-icon">🏆</div>
          <h2 class="record-title">Kỷ Lục Mới!</h2>
          <p class="record-subtitle">Tuyệt vời! Bé đã phá kỷ lục! 🎉</p>
        </div>

        <!-- New Record Time Section -->
        <div class="record-time-section">
          <div class="time-label">⏱️ THỜI GIAN KỶ LỤC MỚI</div>
          <div class="record-time">{{ formatTime(currentDuration) }}</div>

          @if (stats() && stats()!.totalSessions > 1) {
            <div class="improvement-badge">
              <span class="improvement-icon">�</span>
              <span class="improvement-text">Nhanh hơn {{ formatTime(getImprovement()) }} so với kỷ lục cũ!</span>
            </div>
          }
        </div>

        @if (loading()) {
          <div class="loading-stats">
            <div class="spinner"></div>
          </div>
        } @else if (stats()) {
          <!-- Mini Stats Row -->
          <div class="mini-stats">
            <div class="mini-stat">
              <span class="mini-icon">📊</span>
              <span class="mini-value">{{ stats()!.totalSessions }}</span>
              <span class="mini-label">Lần hoàn thành</span>
            </div>
            <div class="mini-stat">
              <span class="mini-icon">⏳</span>
              <span class="mini-value">{{ formatTime(stats()!.averageTimeSeconds) }}</span>
              <span class="mini-label">Trung bình</span>
            </div>
          </div>
        }

        <!-- Celebration Message -->
        <div class="celebration-message">
          <span class="celebration-text">🌟 Bé thật giỏi! Tiếp tục cố gắng nhé! 🌟</span>
        </div>

        <div class="action-buttons">
          <button class="btn btn-primary" (click)="onClose()">
            Tiếp tục 🎮
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
      backdrop-filter: blur(12px);
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
      background: linear-gradient(145deg, #ffffff 0%, #fef9e7 100%);
      border-radius: 24px;
      padding: 1.5rem;
      max-width: 380px;
      width: 90%;
      box-shadow:
        0 25px 80px rgba(0, 0, 0, 0.4),
        0 0 0 4px rgba(255, 215, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
      animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
      position: relative;
      border: 3px solid #ffd700;
    }

    @keyframes bounceIn {
      0% {
        transform: scale(0.3) rotate(-5deg);
        opacity: 0;
      }
      50% {
        transform: scale(1.05) rotate(2deg);
      }
      70% {
        transform: scale(0.95) rotate(-1deg);
      }
      100% {
        transform: scale(1) rotate(0deg);
        opacity: 1;
      }
    }

    .close-btn {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      background: rgba(0, 0, 0, 0.1);
      border: none;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1rem;
      color: #666;
      transition: all 0.2s ease;
    }

    .close-btn:hover {
      background: rgba(0, 0, 0, 0.15);
      transform: rotate(90deg);
    }

    .modal-header {
      text-align: center;
      margin-bottom: 1rem;
    }

    .trophy-icon {
      font-size: 3.5rem;
      animation: trophyBounce 1s ease-in-out infinite;
      filter: drop-shadow(0 4px 8px rgba(255, 215, 0, 0.4));
    }

    @keyframes trophyBounce {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-8px) scale(1.05); }
    }

    .record-title {
      font-size: 1.75rem;
      font-weight: 800;
      background: linear-gradient(135deg, #f6ad55 0%, #ed8936 50%, #dd6b20 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0.25rem 0;
      text-shadow: none;
    }

    .record-subtitle {
      font-size: 0.9rem;
      color: #666;
      margin: 0;
      font-weight: 500;
    }

    .record-time-section {
      background: linear-gradient(135deg, #ff9a56 0%, #ff6b35 100%);
      border-radius: 16px;
      padding: 1rem;
      text-align: center;
      margin-bottom: 1rem;
      color: white;
      box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4);
    }

    .time-label {
      font-size: 0.7rem;
      opacity: 0.95;
      margin-bottom: 0.25rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 600;
    }

    .record-time {
      font-size: 2.25rem;
      font-weight: 800;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      animation: pulseTime 2s ease-in-out infinite;
    }

    @keyframes pulseTime {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.02); }
    }

    .improvement-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(255, 255, 255, 0.25);
      padding: 0.4rem 0.75rem;
      border-radius: 20px;
      margin-top: 0.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      backdrop-filter: blur(4px);
    }

    .improvement-icon {
      font-size: 0.9rem;
    }

    .loading-stats {
      text-align: center;
      padding: 0.5rem;
    }

    .spinner {
      width: 24px;
      height: 24px;
      border: 3px solid rgba(255, 215, 0, 0.3);
      border-top-color: #ffd700;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .mini-stats {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin-bottom: 0.75rem;
    }

    .mini-stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.15rem;
    }

    .mini-icon {
      font-size: 1.1rem;
    }

    .mini-value {
      font-size: 1rem;
      font-weight: 700;
      color: #2d3748;
    }

    .mini-label {
      font-size: 0.6rem;
      color: #718096;
      font-weight: 500;
    }

    .celebration-message {
      background: linear-gradient(135deg, #fef08a 0%, #fde047 100%);
      border-radius: 12px;
      padding: 0.6rem 0.85rem;
      text-align: center;
      margin-bottom: 1rem;
      border: 2px solid #facc15;
    }

    .celebration-text {
      font-size: 0.85rem;
      font-weight: 600;
      color: #854d0e;
    }

    .action-buttons {
      display: flex;
      justify-content: center;
    }

    .btn {
      padding: 0.75rem 2.5rem;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
    }

    .btn-primary:active {
      transform: translateY(0);
    }

    /* Responsive adjustments */
    @media (max-width: 360px) {
      .record-time {
        font-size: 1.75rem;
      }

      .trophy-icon {
        font-size: 2.5rem;
      }

      .record-title {
        font-size: 1.4rem;
      }
    }
  `]
})
export class LessonCompletionStatsComponent implements OnInit, OnDestroy {
  @Input() levelId!: string;
  @Input() currentDuration!: number; // in seconds
  @Input() previousFastestTime?: number; // Optional: previous record before this session
  @Output() close = new EventEmitter<void>();

  private learningService = inject(LearningService);
  private timerService = inject(LessonTimerService);
  private confettiInterval: any;

  stats = signal<CompletionTimeResponse | null>(null);
  loading = signal(true);

  ngOnInit() {
    this.loadStats();
    this.startCelebration();
  }

  ngOnDestroy() {
    this.stopCelebration();
  }

  private startCelebration() {
    // Initial burst
    this.fireConfetti();

    // Continuous celebration
    this.confettiInterval = setInterval(() => {
      this.fireConfetti();
    }, 1500);
  }

  private fireConfetti() {
    // Left side burst
    confetti({
      particleCount: 30,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FF6B35', '#10B981', '#3B82F6'],
      zIndex: 10000
    });

    // Right side burst
    confetti({
      particleCount: 30,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FF6B35', '#10B981', '#3B82F6'],
      zIndex: 10000
    });
  }

  private stopCelebration() {
    if (this.confettiInterval) {
      clearInterval(this.confettiInterval);
    }
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
    this.stopCelebration();
    // Fire one last burst
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      zIndex: 10000
    });
    this.close.emit();
  }

  formatTime(seconds: number): string {
    return this.timerService.formatTimeHuman(seconds);
  }

  getImprovement(): number {
    // If we have previousFastestTime passed from parent, use it
    if (this.previousFastestTime && this.previousFastestTime > 0) {
      return this.previousFastestTime - this.currentDuration;
    }

    // Otherwise, this is likely the first record or we don't have comparison data
    // Return 0 or calculate from recentSessions if available
    const statsData = this.stats();
    if (statsData && statsData.recentSessions && statsData.recentSessions.length > 1) {
      // Find the second fastest time (previous record)
      const sortedTimes = statsData.recentSessions
        .map(s => s.durationSeconds)
        .sort((a, b) => a - b);
      if (sortedTimes.length > 1 && sortedTimes[1] > this.currentDuration) {
        return sortedTimes[1] - this.currentDuration;
      }
    }
    return 0;
  }
}
