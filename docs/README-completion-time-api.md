# API Đo Thời Gian Hoàn Thành Bài Tập

## 📋 Tổng Quan

API này được tạo để theo dõi và phân tích thời gian hoàn thành bài tập của bé, giúp phụ huynh và giáo viên có cái nhìn chi tiết về tiến độ học tập.

## 🎯 Tính Năng

### Backend (NestJS)

#### 1. **Service Layer** (`learning.service.ts`)

- **Method mới**: `getExerciseCompletionTime(userId: string, levelId?: string)`
- **Chức năng**:
  - Lấy tất cả session đã hoàn thành của user
  - Tính toán thống kê: trung bình, nhanh nhất, chậm nhất, tổng thời gian
  - Lấy 10 session gần nhất với đầy đủ thông tin
  - Hỗ trợ filter theo levelId hoặc lấy tất cả

#### 2. **Controller Layer** (`learning.controller.ts`)

- **Endpoint**: `GET /learning/completion-time`
- **Query Params**:
  - `userId` (required): ID của người dùng
  - `levelId` (optional): ID của bài tập cụ thể

### Frontend (Angular)

#### 1. **Service** (`learning.service.ts`)

- **Method mới**: `getCompletionTime(levelId?: string): Observable<CompletionTimeResponse>`
- **Tự động lấy userId** từ AuthService
- **Error handling** với catchError

#### 2. **Interfaces**

```typescript
interface CompletionTimeSession {
  sessionId: number;
  levelId: string;
  levelName: string;
  durationSeconds: number;
  score: number;
  totalQuestions: number;
  accuracyPercentage: number;
  stars: number;
  completedAt: Date;
}

interface CompletionTimeResponse {
  userId: string;
  levelId: string;
  totalSessions: number;
  averageTimeSeconds: number;
  fastestTimeSeconds: number;
  slowestTimeSeconds: number;
  totalTimeSeconds: number;
  recentSessions: CompletionTimeSession[];
}
```

#### 3. **Component Demo** (`completion-time-stats.component.ts`)

Component standalone với UI đẹp mắt bao gồm:

- **Filter dropdown**: Chọn bài tập cụ thể hoặc xem tất cả
- **Summary cards**: Hiển thị thống kê tổng quan với gradient đẹp
- **Recent sessions list**: Danh sách 10 lần hoàn thành gần nhất
- **Loading & Error states**: Xử lý trạng thái loading và lỗi
- **Responsive design**: Tự động điều chỉnh theo kích thước màn hình

## 🚀 Cách Sử Dụng

### 1. Sử dụng Service trực tiếp

```typescript
import { Component, inject } from '@angular/core';
import { LearningService } from '@core/services/learning.service';

export class MyComponent {
  private learningService = inject(LearningService);
  
  loadStats() {
    // Lấy tất cả bài tập
    this.learningService.getCompletionTime().subscribe(data => {
      console.log('Thời gian trung bình:', data.averageTimeSeconds);
    });
    
    // Lấy bài tập cụ thể
    this.learningService.getCompletionTime('counting').subscribe(data => {
      console.log('Thống kê bài Đếm Số:', data);
    });
  }
}
```

### 2. Sử dụng Component có sẵn

```typescript
// Trong routing hoặc parent component
import { CompletionTimeStatsComponent } from '@shared/components/completion-time-stats/completion-time-stats.component';

// Template
<app-completion-time-stats />
```

### 3. Tích hợp vào Parent Dashboard

```typescript
// parent-dashboard.component.ts
import { CompletionTimeStatsComponent } from '@shared/components/completion-time-stats/completion-time-stats.component';

@Component({
  imports: [CompletionTimeStatsComponent, ...],
  template: `
    <div class="dashboard">
      <!-- Các phần khác -->
      <app-completion-time-stats />
    </div>
  `
})
```

## 📊 Dữ Liệu Trả Về

### Ví dụ Response

```json
{
  "userId": "demo-user-123",
  "levelId": "counting",
  "totalSessions": 25,
  "averageTimeSeconds": 145,
  "fastestTimeSeconds": 95,
  "slowestTimeSeconds": 210,
  "totalTimeSeconds": 3625,
  "recentSessions": [
    {
      "sessionId": 456,
      "levelId": "counting",
      "levelName": "Đếm Số",
      "durationSeconds": 120,
      "score": 10,
      "totalQuestions": 10,
      "accuracyPercentage": 100,
      "stars": 3,
      "completedAt": "2026-01-13T13:45:00.000Z"
    }
  ]
}
```

### Trường hợp không có dữ liệu

```json
{
  "userId": "demo-user-123",
  "levelId": "all",
  "totalSessions": 0,
  "averageTimeSeconds": 0,
  "fastestTimeSeconds": 0,
  "slowestTimeSeconds": 0,
  "recentSessions": []
}
```

## 🎨 UI Features

### Summary Cards

- **Tổng số lần**: Hiển thị tổng số lần hoàn thành
- **Thời gian TB**: Thời gian trung bình mỗi lần làm bài
- **Nhanh nhất**: Thời gian nhanh nhất từng đạt được
- **Chậm nhất**: Thời gian chậm nhất
- **Tổng thời gian**: Tổng thời gian đã học

### Recent Sessions

- Hiển thị 10 lần hoàn thành gần nhất
- Thông tin chi tiết: tên bài, thời gian, điểm số, độ chính xác, số sao
- Highlight các bài đạt 3 sao
- Hiển thị ngày giờ hoàn thành

### Interactions

- **Hover effects**: Cards và items có hiệu ứng hover mượt mà
- **Filter dropdown**: Chọn bài tập để xem thống kê cụ thể
- **Retry button**: Nút thử lại khi có lỗi
- **Loading spinner**: Hiển thị khi đang tải dữ liệu

## 🔧 Customization

### Thay đổi số lượng sessions hiển thị

Trong `learning.service.ts` (backend):

```typescript
// Thay đổi từ 10 sang số khác
const recentSessions = sessions.slice(0, 20).map(...)
```

### Thêm level mới vào filter

Trong `completion-time-stats.component.ts`:

```html
<select (change)="onLevelChange($event)">
  <option value="">Tất cả bài tập</option>
  <option value="counting">Đếm Số</option>
  <option value="your-new-level">Bài Mới</option>
</select>
```

### Tùy chỉnh màu sắc cards

Trong styles của component:

```css
.stat-card.your-custom {
  background: linear-gradient(135deg, #color1 0%, #color2 100%);
}
```

## 📝 Notes

- API tự động lọc các session đã bị xóa (`isDeleted: false`)
- Chỉ tính các session đã hoàn thành (`completed: true`)
- Thời gian được lưu và hiển thị bằng giây
- Component sử dụng Angular Signals cho reactive state management
- Standalone component, không cần import module

## 🐛 Troubleshooting

### API trả về lỗi 401

- Kiểm tra user đã đăng nhập chưa
- Verify AuthService.getUserId() có trả về đúng userId

### Không có dữ liệu hiển thị

- Kiểm tra user đã hoàn thành bài tập nào chưa
- Verify database có records trong `learning_sessions` table

### Component không hiển thị

- Đảm bảo đã import `CompletionTimeStatsComponent` vào component cha
- Kiểm tra routing configuration

## 📚 Related Files

- Backend Service: `BE/src/application/services/learning.service.ts`
- Backend Controller: `BE/src/presentation/controllers/learning.controller.ts`
- Frontend Service: `FE/src/app/core/services/learning.service.ts`
- Demo Component: `FE/src/app/shared/components/completion-time-stats/completion-time-stats.component.ts`
- Documentation: `docs/api-completion-time.md`
