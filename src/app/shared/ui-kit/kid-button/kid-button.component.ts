import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsModule } from '../icons/icons.module';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'md' | 'lg';

@Component({
    selector: 'kid-button',
    standalone: true,
    imports: [CommonModule, IconsModule],
    template: `
    <button
      [class]="classes"
      (click)="onClick.emit($event)"
    >
      <ng-content></ng-content>
      <!-- Optional Icon -->
      <lucide-icon
        *ngIf="iconName"
        [name]="iconName"
        [size]="iconSize"
        [strokeWidth]="3"
      ></lucide-icon>
    </button>
  `
})
export class KidButtonComponent {
    @Input() variant: ButtonVariant = 'primary';
    @Input() size: ButtonSize = 'md';
    @Input() iconName?: string;
    @Input() fullWidth: boolean = false;

    @Input() disabled: boolean = false;

    @Output() onClick = new EventEmitter<MouseEvent>();

    get classes(): string {
        const base = 'inline-flex items-center justify-center gap-3 font-extrabold cursor-pointer transition-all duration-200 select-none rounded-full active:scale-95 border-b-[6px] active:border-b-[0px] active:translate-y-[6px]';

        if (this.disabled) {
            // Disabled styles override everything
            // Should keep size classes but override colors and behavior
            let sizeClass = '';
            switch (this.size) {
                case 'md': sizeClass = 'h-14 px-8 text-lg min-w-[140px]'; break;
                case 'lg': sizeClass = 'h-18 px-10 text-2xl min-w-[200px] py-4'; break;
            }
            if (this.fullWidth) sizeClass += ' w-full';

            return `${base} ${sizeClass} bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed pointer-events-none opacity-80 shadow-none border-b-[6px] active:translate-y-0`;
        }

        // Normal Styling
        // Size
        let sizeClass = '';
        switch (this.size) {
            case 'md': sizeClass = 'h-14 px-8 text-lg min-w-[140px]'; break;
            case 'lg': sizeClass = 'h-18 px-10 text-2xl min-w-[200px] py-4'; break;
        }

        if (this.fullWidth) {
            sizeClass += ' w-full';
        }

        // Variants
        let colorClass = '';
        switch (this.variant) {
            case 'primary':
                colorClass = 'bg-gradient-to-r from-kid-secondary to-kid-primary border-[#a21caf] text-white hover:brightness-110 shadow-lg shadow-purple-500/30';
                break;
            case 'secondary':
                colorClass = 'bg-kid-secondary border-[#4338ca] text-white hover:brightness-110 shadow-md shadow-blue-500/30';
                break;
            case 'ghost':
                colorClass = 'bg-transparent border-transparent text-white hover:bg-white/20 border-b-0 active:translate-y-0 active:scale-95';
                break;
        }

        return `${base} ${sizeClass} ${colorClass}`;
    }

    get iconSize(): number {
        return this.size === 'lg' ? 32 : 24;
    }
}
