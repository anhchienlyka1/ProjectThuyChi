import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CardBorderColor = 'primary' | 'secondary' | 'accent' | 'neutral' | 'random';

@Component({
    selector: 'kid-card',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div
      class="bg-white rounded-3xl p-6 shadow-xl border-4 transition-transform hover:scale-[1.02] duration-300"
      [class]="borderClass"
    >
      <ng-content></ng-content>
    </div>
  `
})
export class KidCardComponent {
    @Input() borderColor: CardBorderColor = 'neutral';

    get borderClass(): string {
        let color = this.borderColor;

        if (color === 'random') {
            const colors = ['primary', 'secondary', 'accent'];
            color = colors[Math.floor(Math.random() * colors.length)] as CardBorderColor;
        }

        switch (color) {
            case 'primary': return 'border-kid-primary shadow-kid-primary/10';
            case 'secondary': return 'border-kid-secondary shadow-kid-secondary/10';
            case 'accent': return 'border-kid-accent shadow-kid-accent/10';
            default: return 'border-gray-200 shadow-gray-200/50';
        }
    }
}
