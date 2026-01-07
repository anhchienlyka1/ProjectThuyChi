import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsModule } from '../icons/icons.module';

export type ToastType = 'success' | 'error' | 'info';

@Component({
    selector: 'kid-toast',
    standalone: true,
    imports: [CommonModule, IconsModule],
    template: `
    <div
        *ngIf="visible"
        class="fixed top-8 left-1/2 transform -translate-x-1/2 z-[60] flex items-center gap-4 px-6 py-4 rounded-full shadow-2xl border-4 animate-pop max-w-[90vw]"
        [ngClass]="classes"
    >
        <div class="p-2 bg-white rounded-full">
            <lucide-icon [name]="iconName" [size]="28" [strokeWidth]="3" [class]="iconColorClass"></lucide-icon>
        </div>
        <span class="text-xl font-bold">{{ message }}</span>

        <!-- Close Button -->
        <button (click)="close()" class="ml-2 hover:bg-black/10 rounded-full p-1 transition-colors">
            <lucide-icon name="x" [size]="20"></lucide-icon>
        </button>
    </div>
  `
})
export class KidToastComponent {
    @Input() message: string = '';
    @Input() type: ToastType = 'info';
    @Input() visible: boolean = false;
    @Output() visibleChange = new EventEmitter<boolean>();

    get classes(): string {
        switch (this.type) {
            case 'success': return 'bg-kid-secondary border-teal-600 text-white';
            case 'error': return 'bg-kid-primary border-red-600 text-white';
            default: return 'bg-white border-gray-200 text-kid-text';
        }
    }

    get iconName(): string {
        switch (this.type) {
            case 'success': return 'check';
            case 'error': return 'x';
            default: return 'info'; // Fallback needs an icon
        }
    }

    get iconColorClass(): string {
        switch (this.type) {
            case 'success': return 'text-kid-secondary';
            case 'error': return 'text-kid-primary';
            default: return 'text-gray-500';
        }
    }

    close() {
        this.visible = false;
        this.visibleChange.emit(this.visible);
    }
}
