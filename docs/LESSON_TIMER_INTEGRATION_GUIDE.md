# Hướng Dẫn Tích Hợp Timer và Stats Cho Bài Học

## 📋 Tổng Quan

Tính năng này cho phép đếm thời gian hoàn thành mỗi bài học và hiển thị thống kê so sánh với các lần trước. Bao gồm:

1. **LessonTimerService**: Service quản lý timer cho bài học
2. **LessonTimerComponent**: Component hiển thị timer trên UI
3. **LessonCompletionStatsComponent**: Component hiển thị thống kê sau khi hoàn thành
4. **API Integration**: Tích hợp với API `/learning/completion-time`

## 🎯 Các Component Đã Tạo

### 1. LessonTimerService

**File**: `FE/src/app/core/services/lesson-timer.service.ts`

**Chức năng**:

- Start/Stop/Pause/Resume timer
- Tự động cập nhật mỗi giây
- Format thời gian (MM:SS hoặc HH:MM:SS)
- Signals để reactive updates

**Methods**:

```typescript
startTimer(levelId: string): void
stopTimer(): number  // Returns elapsed seconds
pauseTimer(): void
resumeTimer(): void
getElapsedSeconds(): number
formatTimeHuman(seconds: number): string
```

### 2. LessonTimerComponent

**File**: `FE/src/app/shared/components/lesson-timer/lesson-timer.component.ts`

**Features**:

- Hiển thị thời gian đang chạy
- Compact mode cho header
- Optional pause/resume controls
- Gradient background với shimmer effect
- Pulse animation

**Usage**:

```html
<!-- Compact mode (trong header) -->
<app-lesson-timer [compact]="true"></app-lesson-timer>

<!-- Full mode với controls -->
<app-lesson-timer [showControls]="true" [levelId]="'addition'"></app-lesson-timer>
```

### 3. LessonCompletionStatsComponent

**File**: `FE/src/app/shared/components/lesson-completion-stats/lesson-completion-stats.component.ts`

**Features**:

- Modal overlay hiển thị stats
- So sánh với thời gian trung bình
- Hiển thị kỷ lục mới
- Performance messages động
- Loading state
- Beautiful animations

**Usage**:

```html
<app-lesson-completion-stats 
    *ngIf="showCompletionStats" 
    [levelId]="'addition'" 
    [currentDuration]="completionDuration"
    (close)="closeCompletionStats()">
</app-lesson-completion-stats>
```

## 🔧 Cách Tích Hợp Vào Game Component

### Bước 1: Import Dependencies

```typescript
import { LessonTimerService } from '../../../core/services/lesson-timer.service';
import { LessonTimerComponent } from '../../../shared/components/lesson-timer/lesson-timer.component';
import { LessonCompletionStatsComponent } from '../../../shared/components/lesson-completion-stats/lesson-completion-stats.component';
```

### Bước 2: Thêm vào imports array

```typescript
@Component({
  imports: [
    CommonModule, 
    // ... other imports
    LessonTimerComponent, 
    LessonCompletionStatsComponent
  ],
})
```

### Bước 3: Inject Service và thêm State

```typescript
export class YourGameComponent implements OnInit, OnDestroy {
  private lessonTimer = inject(LessonTimerService);
  
  // State
  showCompletionStats = false;
  completionDuration = 0;
  
  ngOnDestroy() {
    this.lessonTimer.stopTimer();
  }
}
```

### Bước 4: Start Timer khi bắt đầu game

```typescript
startGame() {
  // ... existing code
  
  // Start lesson timer
  this.lessonTimer.startTimer('your-level-id');
  
  // ... rest of code
}
```

### Bước 5: Stop Timer và hiển thị Stats khi kết thúc

```typescript
finishGame() {
  this.isFinished = true;
  
  // Stop timer and get duration
  const durationSeconds = this.lessonTimer.stopTimer();
  this.completionDuration = durationSeconds;

  // Save to backend
  this.learningService.completeSession({
    levelId: 'your-level-id',
    score: this.score,
    totalQuestions: this.totalQuestions,
    durationSeconds: durationSeconds
  }).subscribe({
    next: (response) => {
      // Show completion stats after 2 seconds
      setTimeout(() => {
        this.showCompletionStats = true;
      }, 2000);
    }
  });
}
```

### Bước 6: Thêm method để đóng stats

```typescript
closeCompletionStats() {
  this.showCompletionStats = false;
}
```

### Bước 7: Cập nhật Template

```html
<!-- Thêm timer vào header -->
<div class="header">
  <!-- ... existing header content -->
  <app-lesson-timer [compact]="true"></app-lesson-timer>
</div>

<!-- Thêm stats modal ở cuối file -->
<app-lesson-completion-stats 
    *ngIf="showCompletionStats" 
    [levelId]="'your-level-id'" 
    [currentDuration]="completionDuration"
    (close)="closeCompletionStats()">
</app-lesson-completion-stats>
```

## 📝 Ví Dụ Hoàn Chỉnh

Xem file `addition.component.ts` và `addition.component.html` để tham khảo implementation đầy đủ.

## 🎨 Customization

### Thay đổi màu sắc Timer

Trong `lesson-timer.component.ts`, sửa gradient:

```css
background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
```

### Thay đổi Performance Thresholds

Trong `lesson-completion-stats.component.ts`:

```typescript
getPerformanceMessage(): string | null {
  // Thay đổi -30 thành giá trị khác
  if (diff < -30) {
    return 'Xuất sắc!';
  }
  // ...
}
```

### Thay đổi thời gian hiển thị Stats

Trong game component:

```typescript
setTimeout(() => {
  this.showCompletionStats = true;
}, 2000); // Thay đổi 2000ms thành giá trị khác
```

## 🔍 Testing

### Test Timer

1. Bắt đầu game
2. Kiểm tra timer có đếm không
3. Hoàn thành game
4. Kiểm tra timer đã dừng

### Test Stats Modal

1. Hoàn thành game lần đầu
2. Kiểm tra modal hiển thị
3. Hoàn thành game lần 2
4. Kiểm tra so sánh với lần trước
5. Làm nhanh hơn trung bình → check message "Tốt lắm!"
6. Lập kỷ lục mới → check badge "Kỷ lục mới!"

## 🐛 Troubleshooting

### Timer không đếm

- Kiểm tra `startTimer()` đã được gọi chưa
- Verify levelId đúng format
- Check console có lỗi không

### Stats không hiển thị

- Kiểm tra `showCompletionStats` = true
- Verify `completionDuration` > 0
- Check API response có data không

### Timer không dừng khi rời component

- Đảm bảo implement `ngOnDestroy()`
- Call `this.lessonTimer.stopTimer()` trong `ngOnDestroy()`

## 📊 API Integration

Component tự động gọi API:

```
GET /learning/completion-time?userId=xxx&levelId=yyy
```

Response sẽ bao gồm:

- averageTimeSeconds
- fastestTimeSeconds
- slowestTimeSeconds
- totalSessions
- recentSessions[]

## 🎯 Best Practices

1. **Always stop timer in ngOnDestroy** để tránh memory leaks
2. **Show stats after a delay** để user có thời gian xem kết quả
3. **Use compact timer in header** để không chiếm nhiều space
4. **Provide close button** trong stats modal
5. **Handle loading states** khi fetch API data

## 📚 Related Files

- Service: `FE/src/app/core/services/lesson-timer.service.ts`
- Timer Component: `FE/src/app/shared/components/lesson-timer/lesson-timer.component.ts`
- Stats Component: `FE/src/app/shared/components/lesson-completion-stats/lesson-completion-stats.component.ts`
- Learning Service: `FE/src/app/core/services/learning.service.ts`
- Example: `FE/src/app/features/math-modules/addition/addition.component.ts`
- Backend Service: `BE/src/application/services/learning.service.ts`
- Backend Controller: `BE/src/presentation/controllers/learning.controller.ts`
