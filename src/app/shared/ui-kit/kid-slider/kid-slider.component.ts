import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'kid-slider',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="flex flex-col gap-2 w-full touch-none select-none">
       <label *ngIf="label" class="text-xl font-bold text-kid-text ml-2">{{ label }}: {{ value }}</label>

       <div
         #track
         class="relative h-6 bg-gray-200 rounded-full cursor-pointer"
         (mousedown)="startDrag($event)"
         (touchstart)="startDrag($event)"
       >
          <!-- Fill Track -->
          <div
            class="absolute top-0 left-0 h-full bg-kid-secondary rounded-full"
            [style.width.%]="percentage"
          ></div>

          <!-- Thumb -->
          <div
             class="absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-white border-[4px] border-kid-secondary rounded-full shadow-lg hover:scale-125 transition-transform duration-100 flex items-center justify-center cursor-grab active:cursor-grabbing"
             [style.left.%]="percentage"
             style="transform: translate(-50%, -50%);"
          >
             <div class="w-3 h-3 bg-kid-secondary rounded-full"></div>
          </div>
       </div>
    </div>
  `
})
export class KidSliderComponent {
    @Input() label?: string;
    @Input() min: number = 0;
    @Input() max: number = 100;
    @Input() value: number = 50;
    @Output() valueChange = new EventEmitter<number>();

    @ViewChild('track', { static: true }) track!: ElementRef<HTMLDivElement>;

    private isDragging = false;

    get percentage(): number {
        return ((this.value - this.min) / (this.max - this.min)) * 100;
    }

    startDrag(event: MouseEvent | TouchEvent) {
        this.isDragging = true;
        this.updateValue(event);
    }

    @HostListener('document:mousemove', ['$event'])
    @HostListener('document:touchmove', ['$event'])
    onMove(event: MouseEvent | TouchEvent) {
        if (this.isDragging) {
            this.updateValue(event);
        }
    }

    @HostListener('document:mouseup')
    @HostListener('document:touchend')
    stopDrag() {
        this.isDragging = false;
    }

    private updateValue(event: MouseEvent | TouchEvent) {
        const trackRect = this.track.nativeElement.getBoundingClientRect();
        const clientX = 'touches' in event ? event.touches[0].clientX : (event as MouseEvent).clientX;

        let percent = (clientX - trackRect.left) / trackRect.width;
        percent = Math.max(0, Math.min(1, percent));

        const newValue = Math.round(this.min + percent * (this.max - this.min));

        if (this.value !== newValue) {
            this.value = newValue;
            this.valueChange.emit(this.value);
        }
    }
}
