import { Component, Input, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LessonTimerService } from '../../../core/services/lesson-timer.service';

@Component({
    selector: 'app-lesson-timer',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="lesson-timer" [class.compact]="compact">
      <div class="timer-icon">⏱️</div>
      <div class="timer-display">
        <span class="time">{{ timerService.formattedTime() }}</span>
        @if (!compact) {
          <span class="label">Thời gian</span>
        }
      </div>
      @if (showControls) {
        <div class="timer-controls">
          @if (timerService.isRunning()) {
            <button (click)="pause()" class="control-btn pause" title="Tạm dừng">
              ⏸️
            </button>
          } @else {
            <button (click)="resume()" class="control-btn resume" title="Tiếp tục">
              ▶️
            </button>
          }
        </div>
      }
    </div>
  `,
    styles: [`
    .lesson-timer {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 0.75rem 1.25rem;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      color: white;
      font-family: 'Inter', sans-serif;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .lesson-timer::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      animation: shimmer 3s infinite;
    }

    @keyframes shimmer {
      0% { left: -100%; }
      100% { left: 100%; }
    }

    .lesson-timer.compact {
      padding: 0.5rem 1rem;
      gap: 0.5rem;
    }

    .timer-icon {
      font-size: 1.75rem;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .lesson-timer.compact .timer-icon {
      font-size: 1.25rem;
    }

    .timer-display {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }

    .time {
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      font-variant-numeric: tabular-nums;
    }

    .lesson-timer.compact .time {
      font-size: 1.25rem;
    }

    .label {
      font-size: 0.75rem;
      opacity: 0.9;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .timer-controls {
      display: flex;
      gap: 0.5rem;
      margin-left: 0.5rem;
    }

    .control-btn {
      background: rgba(255, 255, 255, 0.2);
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      padding: 0.375rem 0.75rem;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s ease;
      backdrop-filter: blur(10px);
    }

    .control-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.05);
    }

    .control-btn:active {
      transform: scale(0.95);
    }

    /* Responsive */
    @media (max-width: 640px) {
      .lesson-timer {
        padding: 0.5rem 1rem;
        gap: 0.5rem;
      }

      .timer-icon {
        font-size: 1.25rem;
      }

      .time {
        font-size: 1.125rem;
      }

      .label {
        font-size: 0.625rem;
      }
    }
  `]
})
export class LessonTimerComponent implements OnInit, OnDestroy {
    @Input() compact = false;
    @Input() showControls = false;
    @Input() levelId?: string;

    timerService = inject(LessonTimerService);

    ngOnInit() {
        // Auto-start timer if levelId is provided
        if (this.levelId) {
            this.timerService.startTimer(this.levelId);
        }
    }

    ngOnDestroy() {
        // Don't stop timer on destroy - let the game component handle it
        // This allows timer to persist if component is temporarily unmounted
    }

    pause() {
        this.timerService.pauseTimer();
    }

    resume() {
        this.timerService.resumeTimer();
    }
}
