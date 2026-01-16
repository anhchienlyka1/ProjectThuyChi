# API Đo Thời Gian Hoàn Thành Bài Tập

## Mô tả

API này cho phép lấy thông tin chi tiết về thời gian hoàn thành bài tập của bé, bao gồm:

- Thời gian trung bình
- Thời gian nhanh nhất
- Thời gian chậm nhất
- Tổng thời gian học
- Lịch sử 10 lần hoàn thành gần nhất

## Endpoint

### GET `/learning/completion-time`

**Query Parameters:**

- `userId` (required): ID của người dùng
- `levelId` (optional): ID của bài tập cụ thể. Nếu không truyền, sẽ lấy thông tin của tất cả bài tập

**Response:**

```json
{
  "userId": "user-123",
  "levelId": "counting" | "all",
  "totalSessions": 15,
  "averageTimeSeconds": 120,
  "fastestTimeSeconds": 80,
  "slowestTimeSeconds": 180,
  "totalTimeSeconds": 1800,
  "recentSessions": [
    {
      "sessionId": 123,
      "levelId": "counting",
      "levelName": "Đếm Số",
      "durationSeconds": 95,
      "score": 9,
      "totalQuestions": 10,
      "accuracyPercentage": 90,
      "stars": 3,
      "completedAt": "2026-01-13T13:45:00.000Z"
    }
  ]
}
```

## Sử dụng trong Frontend

### Import Service

```typescript
import { LearningService, CompletionTimeResponse } from '@core/services/learning.service';
```

### Lấy thông tin tất cả bài tập

```typescript
export class MyComponent {
  private learningService = inject(LearningService);
  
  loadAllCompletionTime() {
    this.learningService.getCompletionTime().subscribe({
      next: (data: CompletionTimeResponse) => {
        console.log('Thời gian trung bình:', data.averageTimeSeconds, 'giây');
        console.log('Thời gian nhanh nhất:', data.fastestTimeSeconds, 'giây');
        console.log('Tổng số lần hoàn thành:', data.totalSessions);
        console.log('Lịch sử gần nhất:', data.recentSessions);
      },
      error: (error) => {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    });
  }
}
```

### Lấy thông tin của một bài tập cụ thể

```typescript
loadSpecificLevelTime(levelId: string) {
  this.learningService.getCompletionTime(levelId).subscribe({
    next: (data: CompletionTimeResponse) => {
      console.log(`Thống kê cho bài ${data.levelId}:`, data);
    },
    error: (error) => {
      console.error('Lỗi khi lấy dữ liệu:', error);
    }
  });
}
```

## Ví dụ Hiển thị Thời Gian

### Chuyển đổi giây sang định dạng dễ đọc

```typescript
formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes} phút ${remainingSeconds} giây`;
  }
  return `${seconds} giây`;
}
```

### Component HTML

```html
<div class="completion-stats" *ngIf="completionData">
  <h3>Thống Kê Thời Gian Hoàn Thành</h3>
  
  <div class="stat-card">
    <span class="label">Tổng số lần hoàn thành:</span>
    <span class="value">{{ completionData.totalSessions }}</span>
  </div>
  
  <div class="stat-card">
    <span class="label">Thời gian trung bình:</span>
    <span class="value">{{ formatTime(completionData.averageTimeSeconds) }}</span>
  </div>
  
  <div class="stat-card">
    <span class="label">Thời gian nhanh nhất:</span>
    <span class="value">{{ formatTime(completionData.fastestTimeSeconds) }}</span>
  </div>
  
  <div class="stat-card">
    <span class="label">Thời gian chậm nhất:</span>
    <span class="value">{{ formatTime(completionData.slowestTimeSeconds) }}</span>
  </div>
  
  <h4>Lịch Sử Gần Nhất</h4>
  <div class="recent-sessions">
    <div class="session-item" *ngFor="let session of completionData.recentSessions">
      <div class="session-info">
        <span class="level-name">{{ session.levelName }}</span>
        <span class="time">{{ formatTime(session.durationSeconds) }}</span>
        <span class="score">{{ session.score }}/{{ session.totalQuestions }}</span>
        <span class="stars">⭐ {{ session.stars }}</span>
      </div>
      <div class="session-date">
        {{ session.completedAt | date: 'dd/MM/yyyy HH:mm' }}
      </div>
    </div>
  </div>
</div>
```

## Lưu ý

- API tự động lấy `userId` từ `AuthService` nên không cần truyền thủ công
- Nếu không có dữ liệu, API sẽ trả về `totalSessions: 0` và các giá trị thống kê bằng 0
- Thời gian được tính bằng giây
- Chỉ tính các session đã hoàn thành (`completed: true`)
- Chỉ lấy các session chưa bị xóa (`isDeleted: false`)
