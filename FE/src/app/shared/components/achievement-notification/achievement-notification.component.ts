import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-achievement-notification',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div *ngIf="show" class="achievement-overlay" @slideIn>
      <div class="achievement-card">
        <div class="achievement-badge">
          <div class="badge-glow"></div>
          <div class="badge-icon">{{ achievement?.icon || '🎖️' }}</div>
        </div>
        <h2 class="achievement-title">{{ achievement?.title || 'Phiếu Bé Ngoan' }}</h2>
        <p class="achievement-description">{{ achievement?.description || 'Đã hoàn thành!' }}</p>
        <button class="close-button" (click)="onClose()">Tuyệt vời! ✨</button>
      </div>
    </div>
  `,
    styles: [`
    .achievement-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.3s ease-out;
    }

    .achievement-card {
      background: linear-gradient(135deg, #FFF9E6 0%, #FFE5B4 100%);
      border: 4px solid #FFD700;
      border-radius: 24px;
      padding: 40px;
      max-width: 500px;
      text-align: center;
      box-shadow: 0 20px 60px rgba(255, 215, 0, 0.4);
      animation: popIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    .achievement-badge {
      position: relative;
      width: 120px;
      height: 120px;
      margin: 0 auto 24px;
    }

    .badge-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 140px;
      height: 140px;
      background: radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, transparent 70%);
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    .badge-icon {
      position: relative;
      font-size: 80px;
      line-height: 120px;
      animation: bounce 1s infinite;
    }

    .achievement-title {
      font-size: 32px;
      font-weight: 800;
      color: #FF6B35;
      margin: 0 0 12px;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    }

    .achievement-description {
      font-size: 18px;
      color: #5D4E37;
      margin: 0 0 32px;
      font-weight: 600;
    }

    .close-button {
      background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
      color: white;
      border: none;
      border-radius: 50px;
      padding: 16px 48px;
      font-size: 20px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .close-button:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(255, 107, 53, 0.6);
    }

    .close-button:active {
      transform: scale(0.98);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes popIn {
      0% { transform: scale(0); opacity: 0; }
      80% { transform: scale(1.1); }
      100% { transform: scale(1); opacity: 1; }
    }

    @keyframes pulse {
      0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
      50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.3; }
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `]
})
export class AchievementNotificationComponent {
    @Input() show: boolean = false;
    @Input() achievement: any = null;
    @Output() close = new EventEmitter<void>();

    onClose() {
        this.close.emit();
    }
}
