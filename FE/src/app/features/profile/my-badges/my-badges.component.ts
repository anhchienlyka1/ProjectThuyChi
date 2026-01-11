import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AchievementService } from '../../../core/services/achievement.service';
import { KidButtonComponent } from '../../../shared/ui-kit/kid-button/kid-button.component';

@Component({
    selector: 'app-my-badges',
    standalone: true,
    imports: [
        CommonModule,
        KidButtonComponent,
    ],
    templateUrl: './my-badges.component.html',
    styleUrls: ['./my-badges.component.css']
})
export class MyBadgesComponent {
    achievementService = inject(AchievementService);
    router = inject(Router);

    earnedCount = computed(() =>
        this.achievementService.badges().filter(b => b.unlocked).length
    );

    totalCount = computed(() =>
        this.achievementService.badges().length
    );

    goBack() {
        this.router.navigate(['/profile']);
    }
}
