import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'kid-nav-button',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <a [routerLink]="link"
       class="group relative block w-full aspect-square cursor-pointer select-none transition-transform active:scale-95"
       (mouseenter)="hovered = true"
       (mouseleave)="hovered = false">

      <!-- Shadow/Depth Layer -->
      <div class="absolute inset-0 rounded-3xl translate-y-3 transition-colors duration-300"
           [ngClass]="shadowColorClass">
      </div>

      <!-- Main Button Layer -->
      <div class="absolute inset-0 rounded-3xl flex flex-col items-center justify-center gap-2 border-4 border-white transition-transform duration-300 group-hover:-translate-y-2"
           [ngClass]="bgColorClass">

           <!-- Icon with float animation on hover -->
           <span class="text-6xl filter drop-shadow-md transition-transform duration-500"
                 [class.animate-bounce-slow]="hovered">
             {{ icon }}
           </span>

           <!-- Label -->
           <span class="text-2xl font-black text-white tracking-wide uppercase drop-shadow-md">
             {{ label }}
           </span>
      </div>

      <!-- Shinny reflection (Glass effect) -->
      <div class="absolute top-4 right-4 w-8 h-8 bg-white/30 rounded-full blur-sm"></div>
    </a>
  `,
    styles: [`
    .animate-bounce-slow { animation: bounce 2s infinite; }
    @keyframes bounce {
      0%, 100% { transform: translateY(-5%); }
      50% { transform: translateY(5%); }
    }
  `]
})
export class KidNavButtonComponent {
    @Input({ required: true }) label!: string;
    @Input({ required: true }) icon!: string;
    @Input({ required: true }) link!: string;
    @Input() color: 'blue' | 'pink' | 'yellow' | 'green' = 'blue';

    hovered = false;

    get bgColorClass(): string {
        switch (this.color) {
            case 'blue': return 'bg-blue-400';
            case 'pink': return 'bg-pink-400';
            case 'yellow': return 'bg-yellow-400'; // darker to see white text
            case 'green': return 'bg-green-400';
            default: return 'bg-blue-400';
        }
    }

    get shadowColorClass(): string {
        switch (this.color) {
            case 'blue': return 'bg-blue-600';
            case 'pink': return 'bg-pink-600';
            case 'yellow': return 'bg-yellow-600';
            case 'green': return 'bg-green-600';
            default: return 'bg-blue-600';
        }
    }
}
