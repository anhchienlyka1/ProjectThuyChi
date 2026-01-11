import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { KidButtonComponent } from '../../../shared/ui-kit/kid-button/kid-button.component';

export interface Certificate {
    id: string;
    name: string;
    description: string;
    date?: string;
    unlocked: boolean;
    theme: 'pink' | 'blue' | 'yellow' | 'green';
}

@Component({
    selector: 'app-my-certificates',
    standalone: true,
    imports: [
        CommonModule,
        KidButtonComponent
    ],
    templateUrl: './my-certificates.component.html',
    styleUrls: ['./my-certificates.component.css']
})
export class MyCertificatesComponent {
    private router = inject(Router);

    certificates = signal<Certificate[]>([
        {
            id: 'cert_1',
            name: 'Bé Ngoan Tuần 1',
            description: 'Hoàn thành xuất sắc bài tập tuần 1',
            date: '01/01/2026',
            unlocked: true,
            theme: 'pink'
        },
        {
            id: 'cert_2',
            name: 'Bé Ngoan Tuần 2',
            description: 'Chăm chỉ học toán mỗi ngày',
            date: '08/01/2026',
            unlocked: true,
            theme: 'blue'
        },
        {
            id: 'cert_3',
            name: 'Bé Ngoan Tuần 3',
            description: 'Đạt điểm tối đa 3 bài kiểm tra',
            unlocked: false,
            theme: 'yellow'
        },
        {
            id: 'cert_4',
            name: 'Bé Ngoan Tháng 1',
            description: 'Hoàn thành mọi thử thách tháng 1',
            unlocked: false,
            theme: 'green'
        }
    ]);

    earnedCount = signal(2); // Mock count based on above
    totalCount = signal(4);

    goBack() {
        this.router.navigate(['/profile']);
    }
}
