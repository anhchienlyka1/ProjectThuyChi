import { Component, Input, Output, EventEmitter, ContentChildren, QueryList, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TabItem {
    id: string;
    label: string;
    icon?: string;
}

@Component({
    selector: 'kid-tabs',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="flex flex-col w-full gap-6">
      <!-- Tabs Header -->
      <div class="flex p-2 bg-gray-100/50 rounded-full gap-2 overflow-x-auto no-scrollbar">
        <button
            *ngFor="let tab of tabs"
            (click)="selectTab(tab.id)"
            class="flex-1 py-3 px-6 rounded-full font-bold text-lg transition-all duration-300 relative min-w-[120px]"
            [class.bg-white]="activeTabId === tab.id"
            [class.text-kid-primary]="activeTabId === tab.id"
            [class.shadow-md]="activeTabId === tab.id"
            [class.text-gray-400]="activeTabId !== tab.id"
            [class.hover:bg-white/50]="activeTabId !== tab.id"
        >
             {{ tab.label }}
             <!-- Active Dot -->
             <span *ngIf="activeTabId === tab.id" class="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-kid-primary"></span>
        </button>
      </div>

      <!-- Tab Content Area -->
      <div class="w-full min-h-[100px] animate-pop bg-white border-4 border-gray-50 rounded-[2rem] p-6 shadow-sm">
           <ng-content></ng-content>
      </div>
    </div>
  `
})
export class KidTabsComponent {
    @Input() tabs: TabItem[] = [];
    @Input() activeTabId: string = '';
    @Output() activeTabIdChange = new EventEmitter<string>();

    selectTab(id: string) {
        if (this.activeTabId !== id) {
            this.activeTabId = id;
            this.activeTabIdChange.emit(id);
        }
    }
}
