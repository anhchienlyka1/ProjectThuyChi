import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MascotService } from '../../core/services/mascot.service';
import { KidButtonComponent } from '../../shared/ui-kit/kid-button/kid-button.component';

interface MathLevel {
    id: string;
    levelNumber: number;
    title: string;
    subtitle: string;
    icon: string;
    color: string;
    gradient: string;
    route: string;
    isLocked: boolean;
    stars: number; // Số sao đã đạt được (0-3)
}

@Component({
    selector: 'app-math-modules',
    standalone: true,
    imports: [CommonModule, KidButtonComponent],
    templateUrl: './math-modules.component.html',
    styleUrls: ['./math-modules.component.css']
})
export class MathModulesComponent implements OnInit {
    private router = inject(Router);
    mascot = inject(MascotService);

    levels: MathLevel[] = [
        {
            id: 'counting',
            levelNumber: 1,
            title: 'Đếm Số',
            subtitle: 'Nhận biết số 0-10',
            icon: '🔢',
            color: '#FF6B9D',
            gradient: 'linear-gradient(135deg, #FF6B9D 0%, #FFA8C5 100%)',
            route: '/math/counting',
            isLocked: false,
            stars: 3
        },
        {
            id: 'comparison',
            levelNumber: 2,
            title: 'So Sánh',
            subtitle: 'Lớn - Bé - Bằng',
            icon: '⚖️',
            color: '#4ECDC4',
            gradient: 'linear-gradient(135deg, #4ECDC4 0%, #7FE9DE 100%)',
            route: '/math/comparison',
            isLocked: false,
            stars: 2
        },
        {
            id: 'addition',
            levelNumber: 3,
            title: 'Phép Cộng',
            subtitle: 'Cộng trong phạm vi 10',
            icon: '➕',
            color: '#FFD93D',
            gradient: 'linear-gradient(135deg, #FFD93D 0%, #FFE76F 100%)',
            route: '/math/addition',
            isLocked: false,
            stars: 1
        },
        {
            id: 'shapes',
            levelNumber: 4,
            title: 'Hình Học',
            subtitle: 'Vuông - Tròn - Tam giác',
            icon: '🔷',
            color: '#A78BFA',
            gradient: 'linear-gradient(135deg, #A78BFA 0%, #C4B5FD 100%)',
            route: '/math/shapes',
            isLocked: true,
            stars: 0
        }
    ];

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
