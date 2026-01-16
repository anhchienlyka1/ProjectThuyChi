import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { KidButtonComponent } from '../../../shared/ui-kit/kid-button/kid-button.component';
import { CertificateCardComponent, Certificate } from '../../../shared/components/certificate-card.component';
import { StudentProfileService, Achievement } from '../../../core/services/student-profile.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-my-certificates',
    standalone: true,
    imports: [
        CommonModule,
        KidButtonComponent,
        CertificateCardComponent
    ],
    templateUrl: './my-certificates.component.html',
    styleUrls: ['./my-certificates.component.css']
})
export class MyCertificatesComponent {
    private router = inject(Router);
    private studentProfileService = inject(StudentProfileService);
    private authService = inject(AuthService);

    // Signals for data
    isLoading = signal<boolean>(true);
    certificates = signal<Certificate[]>([]);
    earnedCount = signal(0);
    totalCount = signal(0);

    constructor() {
        this.loadCertificates();
    }

    async loadCertificates() {
        try {
            this.isLoading.set(true);
            const userId = this.authService.getUserId();

            if (!userId) {
                console.error('No user ID found');
                this.isLoading.set(false);
                return;
            }

            // Fetch all achievements (no limit)
            const achievementsData = await this.studentProfileService.getStudentAchievements(userId);

            // Map achievements to certificates format
            const themes: Array<'pink' | 'blue' | 'yellow' | 'green'> = ['pink', 'blue', 'yellow', 'green'];
            const certs: Certificate[] = achievementsData.map((achievement, index) => ({
                id: achievement.id.toString(),
                name: achievement.title,
                description: achievement.description,
                date: new Date(achievement.earnedAt).toLocaleDateString('vi-VN'),
                unlocked: true, // All fetched achievements are earned
                theme: themes[index % themes.length]
            }));

            this.certificates.set(certs);
            this.earnedCount.set(certs.length);
            this.totalCount.set(certs.length); // For now, total = earned (we only show earned achievements)

        } catch (error) {
            console.error('Error loading certificates:', error);
        } finally {
            this.isLoading.set(false);
        }
    }

    goBack() {
        this.router.navigate(['/profile']);
    }
}
