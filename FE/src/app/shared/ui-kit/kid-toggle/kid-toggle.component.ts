import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'kid-toggle',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="flex items-center gap-4 cursor-pointer select-none" (click)="toggle()">
      <!-- Switch Track -->
      <div
        class="relative w-24 h-12 rounded-full border-4 transition-colors duration-300 shadow-inner"
        [class.bg-kid-secondary]="checked"
        [class.border-teal-600]="checked"
        [class.bg-gray-200]="!checked"
        [class.border-gray-300]="!checked"
      >
        <!-- Knob -->
        <div
          class="absolute top-0.5 left-0.5 w-9 h-9 bg-white rounded-full border-2 shadow-md transition-transform duration-300 flex items-center justify-center font-bold text-xs"
          [class.translate-x-12]="checked"
          [class.border-teal-500]="checked"
          [class.text-teal-600]="checked"
          [class.border-gray-400]="!checked"
          [class.text-gray-400]="!checked"
        >
          {{ checked ? 'ON' : 'OFF' }}
        </div>
      </div>

      <!-- Label -->
      <span *ngIf="label" class="text-xl font-bold text-kid-text">{{ label }}</span>
    </div>
  `
})
export class KidToggleComponent {
    @Input() label?: string;
    @Input() checked: boolean = false;
    @Output() checkedChange = new EventEmitter<boolean>();

    toggle() {
        this.checked = !this.checked;
        this.checkedChange.emit(this.checked);
    }
}
