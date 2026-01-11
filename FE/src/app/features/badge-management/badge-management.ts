import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AchievementService, Badge } from '../../core/services/achievement.service';
import { KidCardComponent } from '../../shared/ui-kit/kid-card/kid-card.component';
import { KidButtonComponent } from '../../shared/ui-kit/kid-button/kid-button.component';

@Component({
    selector: 'app-badge-management',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        KidCardComponent,
        KidButtonComponent
    ],
    templateUrl: './badge-management.html',
    styleUrl: './badge-management.css'
})
export class BadgeManagementComponent {
    achievementService = inject(AchievementService);
    private router = inject(Router);

    // Modal state
    showModal = signal(false);
    editingBadge = signal<Badge | null>(null);

    // Form data
    formData = signal({
        id: '',
        name: '',
        description: '',
        icon: '',
        conditionType: 'stars',
        conditionValue: 10,
        unlocked: false
    });

    // Available icons for selection
    availableIcons = [
        '🌟', '⭐', '🏆', '🥇', '🥈', '🥉', '🎖️', '👑',
        '🧮', '📚', '✏️', '📝', '🎨', '🎭', '🎪', '🎯',
        '🚀', '🌈', '🦄', '🎈', '🎉', '🎊', '💎', '💫',
        '🔥', '⚡', '💪', '🌺', '🌸', '🌼', '🌻', '🌷'
    ];

    goBack() {
        this.router.navigate(['/profile']);
    }

    openAddModal() {
        this.editingBadge.set(null);
        this.formData.set({
            id: '',
            name: '',
            description: '',
            icon: '🌟',
            conditionType: 'stars',
            conditionValue: 10,
            unlocked: false
        });
        this.showModal.set(true);
    }

    openEditModal(badge: Badge) {
        this.editingBadge.set(badge);
        // Parse condition to extract type and value
        const conditionStr = badge.condition.toString();
        let conditionType = 'stars';
        let conditionValue = 10;

        if (conditionStr.includes('stars')) {
            conditionType = 'stars';
            const match = conditionStr.match(/>=\s*(\d+)/);
            conditionValue = match ? parseInt(match[1]) : 10;
        } else if (conditionStr.includes('mathCompleted')) {
            conditionType = 'mathCompleted';
            const match = conditionStr.match(/>=\s*(\d+)/);
            conditionValue = match ? parseInt(match[1]) : 5;
        } else if (conditionStr.includes('level')) {
            conditionType = 'level';
            const match = conditionStr.match(/>=\s*(\d+)/);
            conditionValue = match ? parseInt(match[1]) : 5;
        }

        this.formData.set({
            id: badge.id,
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            conditionType,
            conditionValue,
            unlocked: badge.unlocked
        });
        this.showModal.set(true);
    }

    closeModal() {
        this.showModal.set(false);
        this.editingBadge.set(null);
    }

    selectIcon(icon: string) {
        this.formData.update(data => ({ ...data, icon }));
    }

    saveBadge() {
        const data = this.formData();

        // Create condition function based on type
        let condition: (stats: any) => boolean;
        switch (data.conditionType) {
            case 'stars':
                condition = (stats) => stats.stars >= data.conditionValue;
                break;
            case 'mathCompleted':
                condition = (stats) => stats.mathCompleted >= data.conditionValue;
                break;
            case 'level':
                condition = (stats) => stats.level >= data.conditionValue;
                break;
            default:
                condition = (stats) => stats.stars >= data.conditionValue;
        }

        const badge: Badge = {
            id: data.id || this.generateId(),
            name: data.name,
            description: data.description,
            icon: data.icon,
            condition,
            unlocked: data.unlocked
        };

        if (this.editingBadge()) {
            this.achievementService.updateBadge(badge);
        } else {
            this.achievementService.addBadge(badge);
        }

        this.closeModal();
    }

    deleteBadge(badgeId: string) {
        if (confirm('Bạn có chắc chắn muốn xóa huy hiệu này?')) {
            this.achievementService.deleteBadge(badgeId);
        }
    }

    private generateId(): string {
        return 'badge_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}
