import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MascotService } from '../../../core/services/mascot.service';

@Component({
  selector: 'app-mascot',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-0 right-4 z-[100] transition-transform duration-500 ease-in-out pointer-events-none"
         [class.translate-y-full]="emotion() === 'idle' && !message()"
         [class.translate-y-0]="emotion() !== 'idle' || message()">
      
      <!-- Speech Bubble -->
      <div *ngIf="message()" 
           class="absolute bottom-[90%] right-[10%] min-w-[200px] max-w-xs animate-bounce-slight pointer-events-auto z-20">
        <div class="bg-white rounded-2xl rounded-br-none p-4 shadow-xl border-4 border-kid-primary relative overflow-hidden">
             <!-- Decorative background pattern opacity -->
             <div class="absolute inset-0 opacity-10 bg-pattern"></div>
             
             <p class="relative z-10 text-lg font-bold text-gray-800 leading-tight text-center font-heading">
               {{ message() }}
             </p>
        </div>
        <!-- Tail -->
        <div class="absolute -bottom-3 right-4 w-6 h-6 bg-white border-b-4 border-r-4 border-kid-primary transform rotate-45 z-10"></div>
      </div>

      <!-- Mascot Container -->
      <div class="relative w-32 h-32 md:w-48 md:h-48 pointer-events-auto cursor-pointer group"
           (click)="poke()">
        
        <!-- Confetti (Only when celebrating) -->
        <ng-container *ngIf="emotion() === 'celebrating'">
          <div *ngFor="let p of particles" 
               class="absolute bottom-1/2 left-1/2 w-3 h-3 rounded-full animate-confetti z-0"
               [style.backgroundColor]="p.color"
               [style.--tx]="p.tx"
               [style.--ty]="p.ty"
               [style.--rot]="p.rot"
               [style.animationDelay]="p.delay">
          </div>
        </ng-container>

        <!-- Mascot Image Wrapper with rounded crop -->
        <div class="w-full h-full rounded-full overflow-hidden relative z-10">
          <img src="assets/images/Macscot.png" 
               alt="Mascot"
               class="w-full h-full object-cover scale-[1.3] transition-all duration-300"
               [class.animate-bounce-custom]="emotion() === 'happy' || emotion() === 'celebrating'"
               [class.animate-shake]="emotion() === 'sad'"
               [class.animate-pulse]="emotion() === 'thinking'"
               [class.scale-[1.4]]="emotion() === 'celebrating'"
               [class.group-hover:scale-[1.35]]="emotion() === 'idle'"
               >
        </div>
             
        <!-- Thinking Indicator -->
        <div *ngIf="emotion() === 'thinking'" 
             class="absolute -top-4 -left-4 text-4xl animate-bounce">
            🤔
        </div>
      </div>
    </div>
  `,
  styles: [`
    .font-heading {
      font-family: 'Outfit', sans-serif;
    }
    
    .bg-pattern {
      background-image: radial-gradient(#60a5fa 1px, transparent 1px);
      background-size: 10px 10px;
    }

    /* Bounce for Happy/Celebrate */
    .animate-bounce-slight {
      animation: bounce-slight 3s infinite ease-in-out;
    }
    @keyframes bounce-slight {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    
    .animate-bounce-custom {
      animation: bounce-custom 0.8s infinite;
    }
    @keyframes bounce-custom {
        0%, 100% { transform: translateY(0); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
        50% { transform: translateY(-15%); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
    }

    /* Shake for Sad/Error */
    .animate-shake {
      animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
    @keyframes shake {
      10%, 90% { transform: translate3d(-1px, 0, 0); }
      20%, 80% { transform: translate3d(2px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
      40%, 60% { transform: translate3d(4px, 0, 0); }
    }

    /* Confetti Animation */
    @keyframes confetti-explode {
        0% { transform: translate(0, 0) rotate(0deg) scale(0); opacity: 1; }
        50% { opacity: 1; }
        100% { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(1); opacity: 0; }
    }
    .animate-confetti {
        animation: confetti-explode 1.5s ease-out infinite;
    }
  `]
})
export class MascotComponent {
  private mascotService = inject(MascotService);

  emotion = this.mascotService.emotion;
  message = this.mascotService.message;

  // Pre-calculate random particles
  particles = Array.from({ length: 20 }).map(() => ({
    color: ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'][Math.floor(Math.random() * 5)],
    tx: `${(Math.random() - 0.5) * 200}px`, // Spread X
    ty: `${-Math.random() * 200 - 50}px`,   // Upwards Y
    rot: `${Math.random() * 720}deg`,
    delay: `${Math.random() * 0.5}s`
  }));

  poke() {
    if (this.emotion() === 'idle') {
      this.mascotService.setEmotion('happy', 'Hihi! Chạm vào tớ làm gì thế?', true, 2000);
    }
  }
}
