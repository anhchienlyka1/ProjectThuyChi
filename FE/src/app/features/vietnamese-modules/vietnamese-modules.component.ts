import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MascotService } from '../../core/services/mascot.service';
import { KidButtonComponent } from '../../shared/ui-kit/kid-button/kid-button.component';

import { VietnameseLevelService } from '../../core/services/vietnamese-level.service';
import { VietnameseLevel } from '../../core/models/vietnamese-level.model';
import { AgeService } from '../../core/services/age.service';

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

    levels$ = this.vietnameseLevelService.getLevels();

    ngOnInit() {
        this.mascot.setEmotion('happy', 'Chào con! Hãy cùng học Tiếng Việt nhé! 📚', 4000);
    }

    selectLevel(level: VietnameseLevel) {
        if (level.isLocked) {
            this.mascot.setEmotion('sad', 'Ồ! Bài này chưa mở khóa. Hãy hoàn thành bài trước nhé! 🔒', 3000);
            return;
        }

        this.mascot.celebrate();
        setTimeout(() => {
            this.router.navigate([level.route]);
        }, 600);
    }

    onLevelHover(level: VietnameseLevel) {
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
