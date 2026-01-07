import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'kid-avatar',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="relative inline-block">
      <!-- Main Avatar Container -->
      <div
        class="rounded-[2rem] border-[4px] border-white shadow-lg overflow-hidden bg-gray-100 flex items-center justify-center"
        [style.width.px]="size"
        [style.height.px]="size"
        [class]="borderColorClass"
      >
        <img
            *ngIf="src; else placeholder"
            [src]="src"
            alt="Avatar"
            class="w-full h-full object-cover"
        >
        <ng-template #placeholder>
            <span class="text-2xl font-black text-gray-300 select-none">{{ initials || '?' }}</span>
        </ng-template>
      </div>

      <!-- Online/Status Indicator -->
      <div
        *ngIf="status"
        class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white"
        [ngClass]="statusColorClass"
      ></div>
    </div>
  `
})
export class KidAvatarComponent {
    @Input() src?: string;
    @Input() initials?: string;
    @Input() size: number = 64;
    @Input() borderColor: 'primary' | 'secondary' | 'accent' | 'neutral' = 'neutral';
    @Input() status?: 'online' | 'offline' | 'busy';

    get borderColorClass(): string {
        // Using Ring or custom class logic if border color needs to be on the outside
        // The template sets border-white for the inner separation,
        // let's wrap it nicely or just assume neutral background.
        // For this "Happy" look, let's use shadow colors for the specific tint
        switch (this.borderColor) {
            case 'primary': return 'shadow-kid-primary/40 ring-4 ring-kid-primary';
            case 'secondary': return 'shadow-kid-secondary/40 ring-4 ring-kid-secondary';
            case 'accent': return 'shadow-kid-accent/40 ring-4 ring-kid-accent';
            default: return 'shadow-gray-200 ring-4 ring-gray-100';
        }
    }

    get statusColorClass(): string {
        switch (this.status) {
            case 'online': return 'bg-green-400';
            case 'offline': return 'bg-gray-400';
            case 'busy': return 'bg-red-400';
            default: return 'hidden';
        }
    }
}
