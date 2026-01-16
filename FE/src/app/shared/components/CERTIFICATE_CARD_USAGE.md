# Certificate Card Component - Hướng Dẫn Sử Dụng

## Tổng Quan

`CertificateCardComponent` là một component tái sử dụng để hiển thị card phiếu bé ngoan với đầy đủ styling, animation và trạng thái locked/unlocked.

## Vị Trí

```
src/app/shared/components/certificate-card.component.ts
```

## Interface Certificate

```typescript
export interface Certificate {
    id: string;
    name: string;
    description: string;
    date?: string;
    unlocked: boolean;
    theme: 'pink' | 'blue' | 'yellow' | 'green';
}
```

## Cách Sử Dụng

### 1. Import Component và Interface

```typescript
import { CertificateCardComponent, Certificate } from '../../../shared/components/certificate-card.component';

@Component({
    selector: 'app-your-component',
    standalone: true,
    imports: [
        CommonModule,
        CertificateCardComponent  // Thêm vào imports
    ],
    // ...
})
```

### 2. Sử Dụng Trong Template

```html
<!-- Hiển thị một certificate -->
<app-certificate-card [certificate]="myCertificate"></app-certificate-card>

<!-- Hiển thị danh sách certificates -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    @for (cert of certificates(); track cert.id) {
        <app-certificate-card [certificate]="cert"></app-certificate-card>
    }
</div>
```

### 3. Tạo Dữ Liệu Certificate

```typescript
export class YourComponent {
    // Một certificate đơn lẻ
    myCertificate: Certificate = {
        id: 'cert_1',
        name: 'Bé Ngoan Tuần 1',
        description: 'Hoàn thành xuất sắc bài tập tuần 1',
        date: '01/01/2026',
        unlocked: true,
        theme: 'pink'
    };

    // Hoặc một danh sách certificates
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
            unlocked: false,  // Chưa mở khóa
            theme: 'yellow'
        }
    ]);
}
```

## Ví Dụ Thực Tế

### Ví Dụ 1: Hiển thị trên Profile Screen

```typescript
// profile.component.ts
import { CertificateCardComponent, Certificate } from '../../shared/components/certificate-card.component';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, CertificateCardComponent],
    template: `
        <div class="recent-certificates">
            <h2>Phiếu Bé Ngoan Gần Đây</h2>
            <div class="grid grid-cols-2 gap-4">
                @for (cert of recentCertificates(); track cert.id) {
                    <app-certificate-card [certificate]="cert"></app-certificate-card>
                }
            </div>
        </div>
    `
})
export class ProfileComponent {
    recentCertificates = signal<Certificate[]>([
        // 4 certificates gần nhất
    ]);
}
```

### Ví Dụ 2: Hiển thị trên Parent Dashboard

```typescript
// parent-dashboard.component.ts
import { CertificateCardComponent, Certificate } from '../../shared/components/certificate-card.component';

@Component({
    selector: 'app-parent-dashboard',
    standalone: true,
    imports: [CommonModule, CertificateCardComponent],
    template: `
        <div class="child-achievements">
            <h2>Thành Tích Của {{ childName }}</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                @for (cert of childCertificates(); track cert.id) {
                    <app-certificate-card [certificate]="cert"></app-certificate-card>
                }
            </div>
        </div>
    `
})
export class ParentDashboardComponent {
    childName = 'Bé Yêu';
    childCertificates = signal<Certificate[]>([
        // Certificates của con
    ]);
}
```

### Ví Dụ 3: Chuyển đổi từ Badge sang Certificate

Nếu bạn có dữ liệu Badge từ `AchievementService`, bạn có thể chuyển đổi sang Certificate:

```typescript
import { AchievementService, Badge } from '../../core/services/achievement.service';
import { CertificateCardComponent, Certificate } from '../../shared/components/certificate-card.component';

export class SomeComponent {
    achievementService = inject(AchievementService);
    
    // Chuyển đổi Badge thành Certificate
    get certificates(): Certificate[] {
        return this.achievementService.badges().map((badge, index) => ({
            id: badge.id,
            name: badge.name,
            description: badge.description,
            date: badge.unlocked ? this.formatDate(new Date()) : undefined,
            unlocked: badge.unlocked,
            theme: this.getThemeForIndex(index)
        }));
    }
    
    private getThemeForIndex(index: number): 'pink' | 'blue' | 'yellow' | 'green' {
        const themes: ('pink' | 'blue' | 'yellow' | 'green')[] = ['pink', 'blue', 'yellow', 'green'];
        return themes[index % themes.length];
    }
    
    private formatDate(date: Date): string {
        return date.toLocaleDateString('vi-VN');
    }
}
```

## Tính Năng Component

### 1. Trạng Thái Locked/Unlocked

- **Unlocked**: Hiển thị đầy đủ màu sắc, icon 🏵️, có animation quay chậm, hiển thị ngày
- **Locked**: Grayscale, icon 🔒, overlay "Chưa đạt được"

### 2. Theme Colors

- **pink**: Màu hồng (#fbcfe8, #db2777)
- **blue**: Màu xanh dương (#bfdbfe, #2563eb)
- **yellow**: Màu vàng (#fef08a, #ca8a04)
- **green**: Màu xanh lá (#bbf7d0, #16a34a)

### 3. Animations

- Hover: Card nâng lên và xoay nhẹ
- Icon: Quay chậm 30s (khi unlocked)
- Glow effect: Ánh sáng phát ra từ icon

### 4. Responsive

- Mobile: 1 cột
- Tablet: 2 cột (với grid-cols-1 md:grid-cols-2)
- Desktop: Tùy chỉnh theo nhu cầu

## Lưu Ý

- Component này là **standalone**, không cần khai báo trong NgModule
- Tất cả styles đã được tích hợp sẵn trong component
- Không cần import CSS file riêng
- Component tự động xử lý responsive và animations

## Tùy Chỉnh

Nếu bạn muốn tùy chỉnh thêm, có thể:

1. Mở file `certificate-card.component.ts`
2. Chỉnh sửa template hoặc styles trong component
3. Thêm @Input() mới nếu cần thêm tính năng

## Hỗ Trợ

Nếu cần thêm tính năng hoặc có vấn đề, hãy liên hệ team development.
