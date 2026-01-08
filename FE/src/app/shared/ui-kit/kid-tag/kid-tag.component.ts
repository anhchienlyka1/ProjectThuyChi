import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsModule } from '../icons/icons.module';

@Component({
    selector: 'kid-tag',
    standalone: true,
    imports: [CommonModule, IconsModule],
    template: `
    <div
        (click)="toggle()"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 cursor-pointer select-none transition-all duration-200 active:scale-95"
        [ngClass]="classes"
    >
        <lucide-icon *ngIf="selected" name="check" [size]="18" [strokeWidth]="3"></lucide-icon>
        <span class="font-bold text-lg">{{ label }}</span>
    </div>
  `
})
export class KidTagComponent {
    @Input() label: string = '';
    @Input() selected: boolean = false;
    @Input() color: 'primary' | 'secondary' | 'accent' = 'primary';
    @Output() selectedChange = new EventEmitter<boolean>();

    toggle() {
        this.selected = !this.selected;
        this.selectedChange.emit(this.selected);
    }

    get classes(): string {
        if (this.selected) {
            switch (this.color) {
                case 'primary': return 'bg-kid-primary border-kid-primary text-white shadow-md';
                case 'secondary': return 'bg-kid-secondary border-kid-secondary text-white shadow-md';
                case 'accent': return 'bg-kid-accent border-kid-accent text-kid-text shadow-md';
            }
        }
        return 'bg-white border-gray-200 text-gray-400 hover:border-gray-300';
    }
}
