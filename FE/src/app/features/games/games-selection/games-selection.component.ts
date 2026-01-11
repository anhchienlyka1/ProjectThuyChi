import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { KidButtonComponent } from '../../../shared/ui-kit/kid-button/kid-button.component';

@Component({
  selector: 'app-games-selection',
  standalone: true,
  imports: [CommonModule, RouterLink, KidButtonComponent],
  template: `
    <div class="games-selection-container">
      <!-- Back Button -->
      <div class="back-button-wrapper">
        <kid-button variant="neutral" routerLink="/home">← Quay lại</kid-button>
      </div>

      <h1 class="title">Bé Và Ba Mẹ Cùng Chơi Nhé!</h1>
      <div class="games-grid">
        <div class="game-card">
          <div class="game-icon">⚡</div>
          <h2 class="game-name">Đường đua Trí Tuệ</h2>
          <p class="game-desc">Ba mẹ và bé cùng thi xem ai giải toán nhanh hơn để chiến thắng nhé!</p>
          <kid-button variant="primary" routerLink="tug-of-war">Chơi Ngay</kid-button>
        </div>
        <div class="game-card">
          <div class="game-icon">🎯</div>
          <h2 class="game-name">Săn Kho Báu</h2>
          <p class="game-desc">Giải toán để tìm kho báu trên bản đồ bí ẩn!</p>
          <kid-button variant="primary" routerLink="treasure-hunt">Chơi Ngay</kid-button>
        </div>
        <!-- Placeholder for more games -->
         <div class="game-card coming-soon">
          <div class="game-icon">🎲</div>
          <h2 class="game-name">Sắp Ra Mắt</h2>
          <p class="game-desc">Nhiều trò chơi thú vị khác đang chờ đón!</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .games-selection-container {
      min-height: 100vh;
      background: linear-gradient(180deg, #fff1f2 0%, #ffe4e6 100%); /* Soft Pink to match Home/Age vibe */
      padding: 40px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: 'Nunito', sans-serif;
      position: relative;
    }
    .back-button-wrapper {
      position: absolute;
      top: 20px;
      left: 20px;
      z-index: 10;
    }
    .title {
      font-family: 'Nunito', sans-serif;
      font-weight: 900;
      color: #be185d; /* Pink-700 */
      font-size: 3rem;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 3rem;
      text-align: center;
    }
    .games-grid {
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
      justify-content: center;
      max-width: 1200px;
      width: 100%;
    }
    .game-card {
      background: rgba(255, 255, 255, 0.9);
      border-radius: 20px;
      padding: 2rem;
      width: 300px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      border: 4px solid white;
    }
    .game-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
      border-color: #fbcfe8;
    }
    .game-icon {
      font-size: 5rem;
      margin-bottom: 1rem;
    }
    .game-name {
      font-family: 'Nunito', sans-serif;
      font-weight: 800;
      color: #9d174d;
      font-size: 1.8rem;
      margin-bottom: 0.5rem;
    }
    .game-desc {
      color: #666;
      font-family: 'Nunito', sans-serif;
      margin-bottom: 1.5rem;
      line-height: 1.5;
      font-weight: 600;
      flex: 1;
      /* Push button to bottom */
    }
    kid-button {
      margin-top: auto;
      /* Align button at bottom */
    }
    .coming-soon {
        opacity: 0.7;
        filter: grayscale(0.5);
    }
  `]
})
export class GamesSelectionComponent { }
