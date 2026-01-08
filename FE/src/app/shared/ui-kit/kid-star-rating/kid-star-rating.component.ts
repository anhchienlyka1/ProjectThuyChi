import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsModule } from '../icons/icons.module';

@Component({
    selector: 'kid-star-rating',
    standalone: true,
    imports: [CommonModule, IconsModule],
    template: `
    <div class="flex items-center gap-2">
      <div
        *ngFor="let star of stars; let i = index"
        (click)="rate(i + 1)"
        (mouseenter)="hover(i + 1)"
        (mouseleave)="reset()"
        class="cursor-pointer transition-transform duration-200 hover:scale-125"
        [class.animate-wiggle]="i + 1 === hoveredRating"
      >
         <lucide-icon
            name="star"
            [size]="size"
            [strokeWidth]="3"
            [class]="getStarClass(i + 1)"
         ></lucide-icon>
      </div>
    </div>
  `
})
export class KidStarRatingComponent {
    @Input() max: number = 5;
    @Input() rating: number = 0;
    @Input() readonly: boolean = false;
    @Input() size: number = 40;
    @Output() ratingChange = new EventEmitter<number>();

    hoveredRating: number = 0;

    get stars(): number[] {
        return Array(this.max).fill(0);
    }

    rate(value: number) {
        if (this.readonly) return;
        this.rating = value;
        this.ratingChange.emit(this.rating);
    }

    hover(value: number) {
        if (this.readonly) return;
        this.hoveredRating = value;
    }

    reset() {
        if (this.readonly) return;
        this.hoveredRating = 0;
    }

    getStarClass(index: number): string {
        const target = this.hoveredRating || this.rating;
        if (index <= target) {
            if (this.readonly && this.rating === 0) return 'text-gray-300 fill-transparent';
            return 'text-yellow-400 fill-yellow-400 drop-shadow-md';
        }
        return 'text-gray-300 fill-transparent';
    }
}
