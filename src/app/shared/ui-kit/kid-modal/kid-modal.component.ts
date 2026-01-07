import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsModule } from '../icons/icons.module';

@Component({
  selector: 'kid-modal',
  standalone: true,
  imports: [CommonModule, IconsModule],
  template: `
    <div
      *ngIf="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-kid-text/40 backdrop-blur-sm transition-opacity"
      (click)="close()"
    >
      <div
        class="bg-white rounded-[3rem] p-8 w-full max-w-lg shadow-2xl border-[6px] border-kid-accent animate-pop relative"
        (click)="$event.stopPropagation()"
      >
        <!-- Header -->
        <div class="flex justify-between items-start mb-6">
            <h2 class="text-3xl font-black text-kid-text">{{ title }}</h2>
            <button
                (click)="close()"
                class="bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full p-2 transition-colors border-2 border-gray-300"
            >
                <lucide-icon name="x" [size]="32" [strokeWidth]="3"></lucide-icon>
            </button>
        </div>

        <!-- Content -->
        <div class="mb-8">
            <ng-content></ng-content>
        </div>

        <!-- Footer / Actions -->
        <div class="flex justify-end gap-3">
            <ng-content select="[footer]"></ng-content>
        </div>
      </div>
    </div>
  `
})
export class KidModalComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Output() isOpenChange = new EventEmitter<boolean>();

  close() {
    this.isOpen = false;
    this.isOpenChange.emit(this.isOpen);
  }
}
