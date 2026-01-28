import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MascotService } from '../../core/services/mascot.service';
import { KidButtonComponent } from '../../shared/ui-kit/kid-button/kid-button.component';

import { MathLevelService } from '../../core/services/math-level.service';
import { MathLevel } from '../../core/models/math-level.model';
import { DailyProgressService } from '../../core/services/daily-progress.service';


@Component({
    selector: 'app-math-modules',
    standalone: true,
    imports: [CommonModule, KidButtonComponent],
    templateUrl: './math-modules.component.html',
    styleUrls: ['./math-modules.component.css']
})
export class MathModulesComponent implements OnInit {
    private router = inject(Router);
    private mathLevelService = inject(MathLevelService);
    dailyProgress = inject(DailyProgressService);
    mascot = inject(MascotService);

    @ViewChild('scrollContainer') scrollContainer!: ElementRef;

    scroll(direction: 'left' | 'right') {
        if (this.scrollContainer) {
            const container = this.scrollContainer.nativeElement;
            const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of view width
            const targetScroll = direction === 'left'
                ? container.scrollLeft - scrollAmount
                : container.scrollLeft + scrollAmount;

            container.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }
    }

    levels$ = this.mathLevelService.getLevels();

    ngOnInit() {
        // Refresh daily completions to show updated badges
        this.dailyProgress.refreshCompletions().subscribe();
    }

    selectLevel(level: MathLevel) {
        if (level.isLocked) {
            return;
        }

        setTimeout(() => {
            this.router.navigate([level.route]);
        }, 600);
    }

    onLevelHover(level: MathLevel) {
        if (!level.isLocked) {
        }
    }

    onLevelLeave() {
    }

    goBack() {
        setTimeout(() => {
            this.router.navigate(['/select-subject']);
        }, 400);
    }
    // Generate array for stars display
    getStarsArray(count: number): number[] {
        return Array(3).fill(0).map((_, i) => i < count ? 1 : 0);
    }
}
