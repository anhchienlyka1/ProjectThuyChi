import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MascotService } from '../../core/services/mascot.service';
import { KidButtonComponent } from '../../shared/ui-kit/kid-button/kid-button.component';

import { MathLevelService } from '../../core/services/math-level.service';
import { MathLevel } from '../../core/models/math-level.model';


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
    mascot = inject(MascotService);

    levels$ = this.mathLevelService.getLevels();

    ngOnInit() {
        this.mascot.setEmotion('happy', 'Chào con! Hãy chọn bài học yêu thích nhé! 🌟', 4000);
    }

    selectLevel(level: MathLevel) {
        if (level.isLocked) {
            this.mascot.setEmotion('sad', 'Ồ! Bài này chưa mở khóa. Hãy hoàn thành bài trước nhé! 🔒', 3000);
            return;
        }

        this.mascot.celebrate();
        setTimeout(() => {
            this.router.navigate([level.route]);
        }, 600);
    }

    onLevelHover(level: MathLevel) {
        if (!level.isLocked) {
            this.mascot.setEmotion('thinking', `${level.title}: ${level.subtitle} ✨`, 2000);
        }
    }

    onLevelLeave() {
        this.mascot.setEmotion('idle', '', 0);
    }

    goBack() {
        this.mascot.setEmotion('happy', 'Hẹn gặp lại bé nhé! 👋', 2000);
        setTimeout(() => {
            this.router.navigate(['/select-subject']);
        }, 400);
    }
    // Generate array for stars display
    getStarsArray(count: number): number[] {
        return Array(3).fill(0).map((_, i) => i < count ? 1 : 0);
    }
}
