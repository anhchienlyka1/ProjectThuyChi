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

    // Pagination signals
    currentPage = signal(1);
    pageSize = 12;
    hasMore = signal(false);
    isLoadingMore = signal(false);

    constructor() {
        this.loadCertificates();
    }

    async loadCertificates(isLoadMore = false) {
        try {
            const userId = this.authService.getUserId();

            if (!userId) {
                console.error('No user ID found');
                return;
            }

            if (!isLoadMore) {
                this.isLoading.set(true);
                this.currentPage.set(1);
            } else {
                this.isLoadingMore.set(true);
            }

            // Fetch achievements with pagination
            const response = await this.studentProfileService.getStudentAchievements(
                userId,
                this.currentPage(),
                this.pageSize
            );

            const { data, meta } = response;

            // Map achievements to certificates format
            const themes: Array<'pink' | 'blue' | 'yellow' | 'green'> = ['pink', 'blue', 'yellow', 'green'];
            const startIdx = (this.currentPage() - 1) * this.pageSize;

            const newCerts: Certificate[] = data.map((achievement, index) => ({
                id: achievement.id.toString(),
                name: achievement.title,
                description: achievement.description,
                date: new Date(achievement.earnedAt).toLocaleDateString('vi-VN'),
                unlocked: true,
                theme: themes[(startIdx + index) % themes.length]
            }));

            if (isLoadMore) {
                this.certificates.update(current => [...current, ...newCerts]);
            } else {
                this.certificates.set(newCerts);
            }

            this.earnedCount.set(meta.total);
            this.totalCount.set(meta.total);
            this.hasMore.set(this.currentPage() < meta.totalPages);

        } catch (error) {
            console.error('Error loading certificates:', error);
        } finally {
            this.isLoading.set(false);
            this.isLoadingMore.set(false);
        }
    }

    onLoadMore() {
        if (this.hasMore() && !this.isLoadingMore()) {
            this.currentPage.update(p => p + 1);
            this.loadCertificates(true);
        }
    }

    goBack() {
        this.router.navigate(['/profile']);
    }
}
