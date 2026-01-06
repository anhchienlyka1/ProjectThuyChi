import { Component, Input, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KidCardComponent } from '../kid-card/kid-card.component';
import { IconsModule } from '../icons/icons.module';

export interface ColumnDef {
    key: string;
    label: string;
}

@Component({
    selector: 'kid-table',
    standalone: true,
    imports: [CommonModule, KidCardComponent, IconsModule],
    template: `
    <div class="flex flex-col gap-4 w-full">
      <!-- Optional Header Row (often skipped for kids, but good for context) -->
      <div *ngIf="showHeaders" class="flex px-8 mb-2">
        <div
          *ngFor="let col of columns"
          class="flex-1 text-gray-400 font-bold uppercase tracking-wider text-sm"
        >
          {{ col.label }}
        </div>
      </div>

      <!-- Data Rows as Cards -->
      <div
        *ngFor="let row of data; let i = index; let isLast = last"
        class="animate-pop"
        [style.animation-delay]="i * 100 + 'ms'"
      >
        <kid-card [borderColor]="getBorderColor(i)" class="flex items-center">
            <div class="flex items-center w-full">

                <!-- Rank/Index Badge (Optional Visual) -->
                <div class="mr-6 flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-black text-xl text-gray-400">
                    {{ i + 1 }}
                </div>

                <!-- Columns -->
                <div *ngFor="let col of columns" class="flex-1 font-bold text-kid-text text-lg truncate pr-4">
                     <!-- If template for cell is provided (advanced), else text -->
                     {{ row[col.key] }}
                </div>

                <!-- Action Slot Helper -->
                <div class="ml-auto">
                    <ng-content select="[action]"></ng-content>
                </div>
            </div>
        </kid-card>
      </div>

      <!-- Empty State -->
      <div *ngIf="data.length === 0" class="text-center py-10 opacity-50">
          <lucide-icon name="search" [size]="48" class="mx-auto mb-2"></lucide-icon>
          <p class="text-xl font-bold">No data found!</p>
      </div>
    </div>
  `
})
export class KidTableComponent {
    @Input() columns: ColumnDef[] = [];
    @Input() data: any[] = [];
    @Input() showHeaders: boolean = true;

    getBorderColor(index: number): 'primary' | 'secondary' | 'accent' | 'neutral' {
        const colors = ['primary', 'secondary', 'accent', 'neutral'] as const;
        return colors[index % 3]; // Rotate through first 3 main colors
    }
}
