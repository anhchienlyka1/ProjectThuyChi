import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MascotService } from '../../../core/services/mascot.service';

@Component({
    selector: 'app-mascot',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="fixed bottom-0 right-4 z-[100] transition-transform duration-500 ease-in-out hover:scale-105 pointer-events-none"
         [class.translate-y-full]="emotion() === 'idle' && !message()"
         [class.translate-y-0]="emotion() !== 'idle' || message()">
      
      <!-- Speech Bubble -->
      <div *ngIf="message()" 
           class="absolute bottom-[90%] right-[10%] bg-white rounded-2xl rounded-br-none p-4 shadow-xl border-4 border-kid-primary mb-4 w-64 animate-bounce-slight pointer-events-auto">
        <p class="text-lg font-bold text-gray-700 leading-tight">{{ message() }}</p>
      </div>

      <!-- Mascot Image/Representation -->
      <div class="w-32 h-32 md:w-48 md:h-48 relative drop-shadow-2xl">
        <!-- We use emoji for now if no assets, or simple CSS construction -->
        
        <!-- Emotion: Happy/Celebrating -->
        <span *ngIf="emotion() === 'happy' || emotion() === 'celebrating'" class="text-[8rem] md:text-[10rem] leading-none block transform -translate-y-4">
            🐰
        </span>

        <!-- Emotion: Sad -->
        <span *ngIf="emotion() === 'sad'" class="text-[8rem] md:text-[10rem] leading-none block transform skew-x-6">
            😿
        </span>

        <!-- Emotion: Thinking -->
        <span *ngIf="emotion() === 'thinking'" class="text-[8rem] md:text-[10rem] leading-none block animate-pulse">
            🤔
        </span>

        <!-- Emotion: Idle/Default -->
        <span *ngIf="emotion() === 'idle' && message()" class="text-[8rem] md:text-[10rem] leading-none block">
            🐰
        </span>
      </div>
    </div>
  `,
    styles: [`
    .animate-bounce-slight {
      animation: bounce-slight 2s infinite ease-in-out;
    }
    @keyframes bounce-slight {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
  `]
})
export class MascotComponent {
    private mascotService = inject(MascotService);

    emotion = this.mascotService.emotion;
    message = this.mascotService.message;
}
