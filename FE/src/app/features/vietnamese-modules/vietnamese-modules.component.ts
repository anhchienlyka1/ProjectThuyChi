import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MascotService } from '../../core/services/mascot.service';
import { KidButtonComponent } from '../../shared/ui-kit/kid-button/kid-button.component';

import { VietnameseLevelService } from '../../core/services/vietnamese-level.service';
import { VietnameseLevel } from '../../core/models/vietnamese-level.model';
import { AgeService } from '../../core/services/age.service';
import { DailyProgressService } from '../../core/services/daily-progress.service';

@Component({
    selector: 'app-vietnamese-modules',
    standalone: true,
    imports: [CommonModule, KidButtonComponent],
    templateUrl: './vietnamese-modules.component.html',
    styleUrls: ['./vietnamese-modules.component.css']
})
export class VietnameseModulesComponent implements OnInit {
    private router = inject(Router);
    private vietnameseLevelService = inject(VietnameseLevelService);
    private ageService = inject(AgeService);
    mascot = inject(MascotService);
    dailyProgress = inject(DailyProgressService);

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

    levels$ = this.vietnameseLevelService.getLevels();

    ngOnInit() {
        // Refresh daily completions to show updated badges
        // Refresh daily completions to show updated badges
        this.dailyProgress.refreshCompletions();
    }

    selectLevel(level: VietnameseLevel) {
        if (level.isLocked) {
            return;
        }

        setTimeout(() => {
            this.router.navigate([level.route]);
        }, 600);
    }

    onLevelHover(level: VietnameseLevel) {
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
