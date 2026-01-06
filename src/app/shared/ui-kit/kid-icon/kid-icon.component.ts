import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsModule } from '../icons/icons.module';

export type IconColor = 'primary' | 'secondary' | 'accent' | 'neutral';

@Component({
    selector: 'kid-icon',
    standalone: true,
    imports: [CommonModule, IconsModule],
    template: `
    <div
      class="inline-flex items-center justify-center rounded-full shadow-lg border-4 animate-pop"
      [ngClass]="containerClasses"
      [style.width.px]="size"
      [style.height.px]="size"
    >
      <lucide-icon
        [name]="name"
        [size]="innerSize"
        [strokeWidth]="3"
      ></lucide-icon>
    </div>
  `
})
export class KidIconComponent {
    @Input() name!: string;
    @Input() size: number = 64;
    @Input() color: IconColor = 'accent';

    get innerSize(): number {
        return this.size * 0.5;
    }

    get containerClasses(): string {
        switch (this.color) {
            case 'primary': return 'bg-kid-primary border-white text-white rotate-3';
            case 'secondary': return 'bg-kid-secondary border-white text-white -rotate-3';
            case 'accent': return 'bg-kid-accent border-white text-kid-text rotate-6';
            case 'neutral': return 'bg-white border-gray-100 text-gray-400 rotate-0';
            default: return 'bg-gray-200';
        }
    }
}
