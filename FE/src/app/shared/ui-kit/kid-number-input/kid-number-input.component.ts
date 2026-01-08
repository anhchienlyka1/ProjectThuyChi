import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsModule } from '../icons/icons.module';

@Component({
    selector: 'kid-number-input',
    standalone: true,
    imports: [CommonModule, IconsModule],
    template: `
    <div class="inline-flex items-center gap-4 bg-white p-2 rounded-full border-4 border-gray-100 shadow-sm">
      <button
        (click)="decrement()"
        [disabled]="value <= min"
        class="w-12 h-12 rounded-full bg-red-100 text-red-500 border-2 border-red-200 flex items-center justify-center hover:bg-red-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
         <lucide-icon name="minus" [size]="24" [strokeWidth]="4"></lucide-icon>
      </button>

      <span class="text-3xl font-black text-kid-text w-12 text-center select-none">{{ value }}</span>

      <button
        (click)="increment()"
        [disabled]="value >= max"
        class="w-12 h-12 rounded-full bg-green-100 text-green-500 border-2 border-green-200 flex items-center justify-center hover:bg-green-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
         <lucide-icon name="plus" [size]="24" [strokeWidth]="4"></lucide-icon>
      </button>
    </div>
  `
})
export class KidNumberInputComponent {
    @Input() value: number = 0;
    @Input() min: number = 0;
    @Input() max: number = 100;
    @Input() step: number = 1;

    @Output() valueChange = new EventEmitter<number>();

    increment() {
        if (this.value < this.max) {
            this.value += this.step;
            this.valueChange.emit(this.value);
        }
    }

    decrement() {
        if (this.value > this.min) {
            this.value -= this.step;
            this.valueChange.emit(this.value);
        }
    }
}
