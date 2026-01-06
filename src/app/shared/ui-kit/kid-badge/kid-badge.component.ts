import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsModule } from '../icons/icons.module';

export type BadgeVariant = 'gold' | 'silver' | 'bronze' | 'primary' | 'info';

@Component({
    selector: 'kid-badge',
    standalone: true,
    imports: [CommonModule, IconsModule],
    template: `
    <div
      class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border-4 shadow-sm font-black uppercase tracking-wider animate-bounce-in"
      [ngClass]="classes"
    >
      <lucide-icon *ngIf="iconName" [name]="iconName" [size]="20" [strokeWidth]="3"></lucide-icon>
      <span>{{ label }}</span>
    </div>
  `
})
export class KidBadgeComponent {
    @Input() label: string = '';
    @Input() variant: BadgeVariant = 'primary';
    @Input() iconName?: string;

    get classes(): string {
        switch (this.variant) {
            case 'gold': return 'bg-yellow-300 border-yellow-500 text-yellow-900';
            case 'silver': return 'bg-gray-100 border-gray-400 text-gray-700';
            case 'bronze': return 'bg-orange-200 border-orange-700 text-orange-900';
            case 'primary': return 'bg-kid-primary border-kid-primary text-white';
            case 'info': return 'bg-blue-100 border-blue-400 text-blue-800';
            default: return 'bg-white border-gray-200';
        }
    }
}
