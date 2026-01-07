import { Component, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsModule } from '../icons/icons.module';

export interface DropdownItem {
    id: string | number;
    label: string;
    icon?: string;
}

@Component({
    selector: 'kid-dropdown',
    standalone: true,
    imports: [CommonModule, IconsModule],
    template: `
    <div class="relative w-full" (click)="$event.stopPropagation()">
      <label *ngIf="label" class="text-xl font-bold text-kid-text ml-4 mb-2 block">{{ label }}</label>

      <!-- Trigger -->
      <div
        (click)="toggle()"
        class="h-16 w-full rounded-2xl border-[3px] border-gray-300 bg-white px-6 flex items-center justify-between cursor-pointer transition-all hover:border-kid-secondary active:scale-95 select-none"
        [class.border-kid-secondary]="isOpen"
        [class.shadow-md]="isOpen"
      >
        <div class="flex items-center gap-3">
          <lucide-icon *ngIf="selectedItem?.icon" [name]="selectedItem!.icon" [size]="24" class="text-kid-secondary"></lucide-icon>
          <span class="text-xl font-bold" [class.text-gray-400]="!selectedItem" [class.text-kid-text]="selectedItem">
            {{ selectedItem ? selectedItem!.label : placeholder }}
          </span>
        </div>

        <lucide-icon
            name="arrow-right"
            class="text-gray-400 transition-transform duration-200"
            [class.rotate-90]="isOpen"
            [size]="24"
        ></lucide-icon>
      </div>

      <!-- Menu -->
      <div
        *ngIf="isOpen"
        class="absolute top-full mt-2 left-0 w-full bg-white rounded-2xl border-4 border-kid-secondary shadow-xl overflow-hidden z-50 animate-pop"
      >
        <div
            *ngFor="let item of items"
            (click)="select(item)"
            class="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-teal-50 border-b-2 border-gray-100 last:border-0 transition-colors"
        >
             <div *ngIf="item.icon" class="p-2 bg-white rounded-full border-2 border-gray-200 shadow-sm text-kid-secondary">
                 <lucide-icon [name]="item.icon" [size]="20"></lucide-icon>
             </div>
             <span class="text-lg font-bold text-kid-text">{{ item.label }}</span>

             <!-- Selected Check -->
             <lucide-icon *ngIf="selectedItem?.id === item.id" name="check" class="ml-auto text-kid-secondary" [size]="24" [strokeWidth]="3"></lucide-icon>
        </div>
      </div>

    </div>
  `
})
export class KidDropdownComponent {
    @Input() label?: string;
    @Input() placeholder: string = 'Select...';
    @Input() items: DropdownItem[] = [];
    @Input() selectedId?: string | number;

    @Output() onChange = new EventEmitter<DropdownItem>();

    isOpen = false;

    get selectedItem() {
        return this.items.find(i => i.id === this.selectedId);
    }

    constructor(private eRef: ElementRef) { }

    toggle() {
        this.isOpen = !this.isOpen;
    }

    select(item: DropdownItem) {
        this.selectedId = item.id;
        this.isOpen = false;
        this.onChange.emit(item);
    }

    @HostListener('document:click', ['$event'])
    clickout(event: any) {
        if (!this.eRef.nativeElement.contains(event.target)) {
            this.isOpen = false;
        }
    }
}
