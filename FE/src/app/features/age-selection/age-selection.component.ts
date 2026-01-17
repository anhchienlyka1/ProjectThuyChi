import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { KidButtonComponent } from '../../shared/ui-kit/kid-button/kid-button.component';
import { MascotService } from '../../core/services/mascot.service';

import { AgeService } from '../../core/services/age.service';
import { AgeOption } from '../../core/models/age.model';

@Component({
  selector: 'app-age-selection',
  standalone: true,
  imports: [CommonModule, KidButtonComponent],
  template: `
    <div class="selection-container">

      <!-- Back Button -->
      <div class="back-button-wrapper">
        <kid-button (click)="goBack()" variant="neutral" size="md">
          ← Quay lại
        </kid-button>
      </div>

      <!-- Decorative Floating Icons -->
      <div class="floating-decorations">
        <div class="floating-icon icon-1">🎂</div>
        <div class="floating-icon icon-2">🎈</div>
        <div class="floating-icon icon-3">🎁</div>
        <div class="floating-icon icon-4">✨</div>
      </div>

      <!-- Header -->
      <div class="header">
        <h1 class="page-title">Bé bao nhiêu tuổi?</h1>
        <p class="page-subtitle">Chọn số tuổi của mình nhé!</p>
      </div>

      <!-- Age Grid -->
      <div class="age-grid">
        <div *ngFor="let age of ages$ | async"
             class="age-card"
             [class.disabled]="isAgeDisabled(age.value)"
             [style.background]="age.gradient"
             (click)="selectAge(age)"
             (mouseenter)="onAgeHover(age)"
             (mouseleave)="onAgeLeave()">

          <span class="age-number">{{ age.value }}</span>
          <span class="age-label">{{ age.label }}</span>

          <!-- Decorative shine effect -->
          <div class="card-shine"></div>
        </div>
      </div>

      <!-- Bottom Animation Scene -->
      <div class="bottom-scene">

        <!-- Moving Hills Background -->
        <div class="hills-container">
          <div class="hill hill-1"></div>
          <div class="hill hill-2"></div>
          <div class="hill hill-3"></div>
        </div>

        <!-- Train Track -->
        <div class="track"></div>

        <!-- Animated Train -->
        <div class="train-container">
          <div class="train">
            <div class="smoke">☁️</div>
            <div class="engine">🚂</div>
            <div class="wagon">🚃</div>
            <div class="wagon">🚃</div>
            <div class="wagon">🚃</div>
            <div class="wagon">🚃</div>
          </div>
        </div>

        <!-- Foreground Vegetation -->
        <div class="vegetation">
          <div class="tree tree-1">🌲</div>
          <div class="tree tree-2">🌳</div>
          <div class="flower flower-1">🌻</div>
          <div class="flower flower-2">🌷</div>
          <div class="animal animal-lion">🦁</div>
          <div class="animal animal-elephant">🐘</div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .selection-container {
      min-height: 100vh;
      background: linear-gradient(180deg, #bae6fd 0%, #7dd3fc 60%, #38bdf8 100%);
      padding: 40px 20px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      overflow: hidden;
    }

    .back-button-wrapper {
      position: absolute;
      top: 30px;
      left: 30px;
      z-index: 20;
    }

    /* Removed old .back-button styles */

    .floating-decorations {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 1;
    }

    .floating-icon {
      position: absolute;
      font-size: 3rem;
      opacity: 0.2;
      animation: float-gentle 6s ease-in-out infinite;
    }

    .icon-1 { top: 15%; right: 10%; animation-delay: 0s; }
    .icon-2 { bottom: 40%; left: 10%; animation-delay: 2s; }
    .icon-3 { top: 25%; left: 20%; animation-delay: 1s; }
    .icon-4 { bottom: 50%; right: 15%; animation-delay: 3s; }

    @keyframes float-gentle {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }

    .header {
      text-align: center;
      margin-bottom: 40px;
      position: relative;
      z-index: 5;
    }

    .page-title {
      font-size: 3.5rem;
      font-weight: 900;
      color: #0369a1;
      text-shadow: 0 2px 4px rgba(255,255,255,0.5);
      margin: 0;
    }

    .page-subtitle {
      font-size: 1.5rem;
      color: #0c4a6e;
      margin-top: 10px;
      font-weight: 600;
    }

    .age-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
      justify-content: center;
      max-width: 900px;
      position: relative;
      z-index: 10;
      animation: fadeIn 0.8s ease-out;
    }

    .age-card {
      width: 150px;
      height: 200px;
      border-radius: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      border: 4px solid rgba(255,255,255,0.4);
      background-color: rgba(255,255,255,0.1); /* fallback */
    }

    .age-card:not(.disabled):hover {
      transform: translateY(-15px) scale(1.05);
      box-shadow: 0 25px 35px rgba(0,0,0,0.15);
      border-color: white;
    }

    .age-card.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      filter: grayscale(0.8);
    }

    .age-number {
      font-size: 5rem;
      font-weight: 900;
      color: white;
      line-height: 1;
      text-shadow: 3px 3px 0 rgba(0,0,0,0.1);
    }

    .age-label {
      font-size: 1.25rem;
      font-weight: 700;
      color: white;
      margin-top: 12px;
    }

    .card-shine {
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
      transform: translateX(-100%);
      transition: transform 0.5s;
    }

    .age-card:not(.disabled):hover .card-shine {
      transform: translateX(100%);
    }

    /* Bottom Animation Scene Styles */
    .bottom-scene {
      margin-top: auto;
      width: 100%;
      height: 200px;
      position: absolute;
      bottom: 0;
      left: 0;
      overflow: hidden;
      z-index: 1;
    }

    .hills-container {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 100%;
    }

    .hill {
      position: absolute;
      border-radius: 50% 50% 0 0;
    }

    .hill-1 {
      width: 120%;
      height: 150px;
      background: #84cc16; /* lime-500 */
      bottom: -20px;
      left: -10%;
      opacity: 0.8;
    }

    .hill-2 {
      width: 100%;
      height: 200px;
      background: #65a30d; /* lime-600 */
      bottom: -80px;
      right: -20%;
      opacity: 0.6;
    }

    .hill-3 {
      width: 80%;
      height: 120px;
      background: #4d7c0f; /* lime-700 */
      bottom: -10px;
      left: 20%;
      opacity: 0.4;
      z-index: -1;
    }

    .track {
      position: absolute;
      bottom: 40px;
      left: 0;
      width: 100%;
      height: 4px;
      background: #57534e;
      z-index: 2;
    }

    .track::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 10px;
        background-image: repeating-linear-gradient(90deg, #57534e 0, #57534e 5px, transparent 5px, transparent 20px);
        top: 2px;
    }

    .train-container {
      position: absolute;
      bottom: 20px;
      left: -300px; /* Start off screen */
      z-index: 3;
      animation: driveTrain 15s linear infinite;
    }

    .train {
      display: flex;
      align-items: flex-end;
      font-size: 6rem;
      filter: drop-shadow(4px 4px 8px rgba(0,0,0,0.2));
      position: relative;
      transform: scaleX(-1); /* Flip the train to face right */
    }

    .engine, .wagon {
        position: relative;
        margin-right: -10px; /* Connect them closer */
        animation: bounce 0.5s ease-in-out infinite alternate;
    }

    .wagon:nth-child(even) { animation-delay: 0.1s; }
    .wagon:nth-child(odd) { animation-delay: 0.2s; }

    .smoke {
        position: absolute;
        top: -40px;
        left: 20px;
        font-size: 2rem;
        opacity: 0;
        animation: puffSmoke 2s ease-out infinite;
    }

    .vegetation {
        position: absolute;
        bottom: 10px;
        width: 100%;
        z-index: 4;
        pointer-events: none;
    }

    .tree {
        position: absolute;
        font-size: 4rem;
        bottom: 20px;
    }

    .tree-1 { left: 10%; }
    .tree-2 { right: 15%; filter: hue-rotate(20deg); }

    .flower {
        position: absolute;
        font-size: 2rem;
        bottom: 25px;
        animation: sway 3s ease-in-out infinite;
    }

    .flower-1 { left: 30%; animation-delay: 0.5s; }
    .flower-2 { right: 35%; animation-delay: 1.5s; }

    .animal {
        position: absolute;
        font-size: 3.5rem;
        bottom: 25px;
        z-index: 5;
        filter: drop-shadow(0 4px 4px rgba(0,0,0,0.1));
    }

    .animal-lion {
        left: 20%;
        animation: bounce 2s ease-in-out infinite alternate;
    }

    .animal-elephant {
        right: 25%;
        animation: bounce 2.5s ease-in-out infinite alternate-reverse;
    }

    @keyframes driveTrain {
      0% { transform: translateX(0); }
      100% { transform: translateX(120vw); } /* Move across screen */
    }

    @keyframes bounce {
      from { transform: translateY(0); }
      to { transform: translateY(-3px); }
    }

    @keyframes puffSmoke {
        0% { transform: translateY(0) scale(0.5); opacity: 0.8; }
        100% { transform: translateY(-50px) scale(1.5); opacity: 0; }
    }

    @keyframes sway {
        0%, 100% { transform: rotate(-5deg); }
        50% { transform: rotate(5deg); }
    }

    @keyframes peek {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class AgeSelectionComponent {
  private router = inject(Router);
  private ageService = inject(AgeService);
  mascot = inject(MascotService);

  ages$ = this.ageService.getAges();



  allowedAges = [3, 6];

  isAgeDisabled(age: number, validAges: number[] = this.allowedAges): boolean {
    return !validAges.includes(age);
  }

  selectAge(age: AgeOption) {
    if (this.isAgeDisabled(age.value)) {
      return;
    }

    this.ageService.selectedAge = age.value;

    this.mascot.setEmotion('happy', `Bé ${age.value} tuổi rồi. Lớn quá nhỉ!`, 2000);
    setTimeout(() => {
      // Navigate to select subject after selecting age
      this.router.navigate(['/select-subject']);
    }, 500);
  }

  onAgeHover(age: AgeOption) {
    if (this.isAgeDisabled(age.value)) {
      return;
    }
    this.mascot.setEmotion('thinking', `Bé là ${age.value} tuổi đúng không?`, 1500);
  }

  onAgeLeave() {
    this.mascot.message.set('');
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
