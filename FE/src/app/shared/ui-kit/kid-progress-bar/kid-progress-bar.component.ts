import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'kid-progress-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
        class="w-full bg-black/10 rounded-full border-4 border-white shadow-inner overflow-hidden"
        [style.height.px]="height"
    >
      <div
        class="h-full transition-all duration-500 ease-out relative overflow-hidden flex items-center justify-end px-2"
        [style.width.%]="value"
        [ngClass]="colorClass"
      >
        <!-- Stripe Pattern overlay -->
        <div *ngIf="striped" class="absolute inset-0 w-full h-full animate-[wiggle_2s_linear_infinite] opacity-30"
             style="background-image: linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent); background-size: 40px 40px;">
        </div>

        <!-- Label if desired -->
        <span *ngIf="showLabel && value > 15" class="text-white font-bold text-xs z-10 drop-shadow-md">{{ value }}%</span>
      </div>
    </div>
  `
})
export class KidProgressBarComponent {
  @Input() value: number = 0;
  @Input() height: number = 32;
  @Input() color: 'primary' | 'secondary' | 'accent' = 'primary';
  @Input() striped: boolean = true;
  @Input() showLabel: boolean = false;

  get colorClass(): string {
    switch (this.color) {
      case 'primary': return 'bg-gradient-to-r from-kid-secondary to-kid-primary';
      case 'secondary': return 'bg-kid-secondary';
      case 'accent': return 'bg-kid-accent';
      default: return 'bg-gray-400';
    }
  }
}
