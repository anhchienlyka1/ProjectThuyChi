import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard.service';
import { StudentSwitcherService } from '../../core/services/student-switcher.service';

interface Certificate {
    id: number;
    achievementId: string;
    title: string;
    description: string;
    icon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    earnedAt: Date;
    weekNumber: number;
    isUnlocked: boolean;
    earnedContext?: any;
}

@Component({
    selector: 'app-certificate-collection',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="max-w-7xl mx-auto space-y-6 pt-6">
      
      <!-- Header -->
      <div class="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 rounded-3xl p-8 text-white shadow-xl">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold mb-2">🏆 Bộ Sưu Tập Phiếu Bé Ngoan</h1>
            <p class="text-white/90 text-lg">
              @if (selectedStudent()) {
                <strong>{{ selectedStudent()?.name }}</strong> đã nhận được {{ totalCertificates() }} phiếu bé ngoan
              }
            </p>
          </div>
          <div class="hidden md:block">
            <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div class="text-4xl font-bold">{{ totalCertificates() }}</div>
              <div class="text-sm text-white/80">Tổng số phiếu</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Certificates Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        @for (cert of certificates(); track cert.id) {
          <div 
            class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2"
            [class]="getCertificateBorderClass(cert.rarity)">
            
            <!-- Certificate Header -->
            <div class="text-center mb-4">
              <div class="text-6xl mb-3">{{ cert.icon }}</div>
              <h3 class="font-bold text-lg text-gray-800 mb-1">{{ cert.title }}</h3>
              <p class="text-sm text-gray-500">{{ cert.description }}</p>
            </div>

            <!-- Certificate Date -->
            <div class="flex items-center justify-center gap-2 text-sm text-gray-600 mb-3">
              <span class="text-lg">📅</span>
              <span>{{ formatDate(cert.earnedAt) }}</span>
            </div>

            <!-- Rarity Badge -->
            <div class="flex justify-center">
              <span 
                class="px-3 py-1 rounded-full text-xs font-semibold"
                [class]="getRarityBadgeClass(cert.rarity)">
                {{ getRarityLabel(cert.rarity) }}
              </span>
            </div>

            <!-- Week Number Badge -->
            <div class="mt-3 text-center">
              <span class="text-xs text-gray-500">Tuần {{ cert.weekNumber }}</span>
            </div>
          </div>
        }
      </div>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      }

      <!-- Empty State -->
      @if (!isLoading() && certificates().length === 0) {
        <div class="bg-white rounded-2xl p-12 text-center shadow-lg">
          <div class="text-6xl mb-4">🎯</div>
          <h3 class="text-2xl font-bold text-gray-800 mb-2">Chưa có phiếu bé ngoan</h3>
          <p class="text-gray-500">Hãy cố gắng học tập để nhận phiếu bé ngoan đầu tiên nhé!</p>
        </div>
      }

      <!-- Load More Button -->
      @if (hasMore() && !isLoading()) {
        <div class="flex justify-center">
          <button 
            (click)="loadMoreCertificates()"
            class="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            Xem thêm
          </button>
        </div>
      }

    </div>
  `,
    styles: [`
    :host {
      display: block;
    }
  `]
})
export class CertificateCollectionComponent implements OnInit {
    private dashboardService = inject(DashboardService);
    private studentSwitcherService = inject(StudentSwitcherService);

    selectedStudent = this.studentSwitcherService.selectedStudent;
    certificates = signal<Certificate[]>([]);
    totalCertificates = signal(0);
    hasMore = signal(false);
    isLoading = signal(false);

    private pageSize = 20;

    ngOnInit(): void {
        // Listen for student changes
        window.addEventListener('studentChanged', () => {
            this.loadCertificates();
        });

        // Initial load
        this.loadCertificates();
    }

    async loadCertificates(): Promise<void> {
        const student = this.selectedStudent();

        if (!student) return;

        this.isLoading.set(true);

        try {
            const response = await this.dashboardService.getCertificates(student.id, {
                limit: this.pageSize,
                offset: 0
            });

            this.certificates.set(response.certificates);
            this.totalCertificates.set(response.total);
            this.hasMore.set(response.hasMore);
        } catch (error) {
            console.error('Failed to load certificates', error);
        } finally {
            this.isLoading.set(false);
        }
    }

    async loadMoreCertificates(): Promise<void> {
        const student = this.selectedStudent();

        if (!student) return;

        this.isLoading.set(true);

        try {
            const currentCount = this.certificates().length;
            const response = await this.dashboardService.getCertificates(student.id, {
                limit: this.pageSize,
                offset: currentCount
            });

            this.certificates.update(certs => [...certs, ...response.certificates]);
            this.hasMore.set(response.hasMore);
        } catch (error) {
            console.error('Failed to load more certificates', error);
        } finally {
            this.isLoading.set(false);
        }
    }

    getCertificateBorderClass(rarity: string): string {
        switch (rarity) {
            case 'legendary':
                return 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50';
            case 'epic':
                return 'border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50';
            case 'rare':
                return 'border-blue-400 bg-gradient-to-br from-blue-50 to-cyan-50';
            default:
                return 'border-gray-300 bg-white';
        }
    }

    getRarityBadgeClass(rarity: string): string {
        switch (rarity) {
            case 'legendary':
                return 'bg-yellow-100 text-yellow-800';
            case 'epic':
                return 'bg-purple-100 text-purple-800';
            case 'rare':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    getRarityLabel(rarity: string): string {
        switch (rarity) {
            case 'legendary':
                return 'Huyền Thoại';
            case 'epic':
                return 'Sử Thi';
            case 'rare':
                return 'Hiếm';
            default:
                return 'Thường';
        }
    }

    formatDate(date: Date): string {
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(new Date(date));
    }
}
