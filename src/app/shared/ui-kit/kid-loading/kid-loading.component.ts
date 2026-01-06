import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'kid-loading',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div
      *ngIf="show"
      class="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-bounce-in"
    >
      <div class="flex items-center gap-4">
        <div class="w-8 h-8 rounded-full bg-kid-primary animate-bounce" style="animation-duration: 0.6s"></div>
        <div class="w-8 h-8 rounded-full bg-kid-secondary animate-bounce" style="animation-delay: 0.1s; animation-duration: 0.6s"></div>
        <div class="w-8 h-8 rounded-full bg-kid-accent animate-bounce" style="animation-delay: 0.2s; animation-duration: 0.6s"></div>
      </div>
      <p class="mt-8 text-2xl font-black text-kid-text animate-pulse">Loading...</p>
    </div>
  `
})
export class KidLoadingComponent {
    @Input() show: boolean = false;
}
