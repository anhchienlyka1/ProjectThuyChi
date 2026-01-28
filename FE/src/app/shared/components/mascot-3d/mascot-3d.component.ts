import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SplineSceneComponent } from '../spline-scene.component';

@Component({
    selector: 'app-mascot-3d',
    standalone: true,
    imports: [CommonModule, SplineSceneComponent],
    template: `
    <div class="mascot-container" [class.speaking]="isSpeaking">
      <!-- 3D Scene -->
      <div class="spline-wrapper">
        <app-spline-scene 
          [sceneUrl]="characterUrl"
          loading="eager">
        </app-spline-scene>
      </div>

      <!-- Dialogue Bubble -->
      <div class="dialogue-bubble" *ngIf="message">
        <p>{{ message }}</p>
        <div class="bubble-tail"></div>
      </div>
    </div>
  `,
    styles: [`
    .mascot-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 200px;
      height: 200px;
      z-index: 100;
      pointer-events: none; /* Let clicks pass through empty areas */
    }

    .spline-wrapper {
      width: 100%;
      height: 100%;
      pointer-events: auto; /* Re-enable clicks for the 3D model */
      filter: drop-shadow(0 10px 20px rgba(0,0,0,0.2));
      transition: transform 0.3s ease;
    }

    .mascot-container:hover .spline-wrapper {
      transform: scale(1.1) translateY(-10px);
    }

    .dialogue-bubble {
      position: absolute;
      bottom: 180px; /* Position above head */
      right: 20px;
      background: white;
      padding: 15px 25px;
      border-radius: 20px;
      border-bottom-right-radius: 4px; /* Stylized tail anchor */
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      max-width: 250px;
      animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      pointer-events: auto;
    }

    .dialogue-bubble p {
      margin: 0;
      color: #4b5563;
      font-weight: 600;
      font-size: 0.95rem;
      line-height: 1.4;
    }

    @keyframes popIn {
      from { opacity: 0; transform: scale(0.8) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
  `]
})
export class Mascot3dComponent {
    @Input() message: string = '';
    @Input() isSpeaking: boolean = false;

    // URL for a 3D Character (Using a different one or same as backup)
    // Demo URL: Cute Robot/Character
    characterUrl = 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode';
}
