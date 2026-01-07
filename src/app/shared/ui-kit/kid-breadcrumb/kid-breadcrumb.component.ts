import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsModule } from '../icons/icons.module';

export interface BreadcrumbItem {
    label: string;
    link?: string; // In a real app, you'd use RouterLink
}

@Component({
    selector: 'kid-breadcrumb',
    standalone: true,
    imports: [CommonModule, IconsModule],
    template: `
    <nav class="flex items-center flex-wrap gap-2">
      <ng-container *ngFor="let item of items; let i = index; let last = last">
        <!-- Item -->
        <div
            class="flex items-center px-4 py-2 rounded-full font-bold transition-colors"
            [class.bg-white]="!last"
            [class.text-gray-500]="!last"
            [class.bg-kid-accent]="last"
            [class.text-kid-text]="last"
            [class.shadow-sm]="last"
            [class.border-2]="!last"
            [class.border-gray-100]="!last"
            [class.border-kid-accent]="last"
        >
            {{ item.label }}
        </div>

        <!-- Separator -->
        <lucide-icon
            *ngIf="!last"
            name="arrow-right"
            [size]="20"
            class="text-gray-300"
        ></lucide-icon>
      </ng-container>
    </nav>
  `
})
export class KidBreadcrumbComponent {
    @Input() items: BreadcrumbItem[] = [];
}
