# Daily Progress Tracking Feature

## Tổng quan

Tính năng theo dõi tiến độ hàng ngày cho phép người dùng xem số lần họ đã hoàn thành mỗi bài học trong ngày hôm nay. Dữ liệu sẽ tự động reset vào ngày mới.

## Các thành phần

### 1. DailyProgressService

**File**: `src/app/core/services/daily-progress.service.ts`

Service này quản lý việc lưu trữ và theo dõi số lần hoàn thành bài học trong ngày:

- **Lưu trữ**: Sử dụng `localStorage` để lưu dữ liệu
- **Format dữ liệu**:

  ```typescript
  {
    date: "2026-01-11",  // YYYY-MM-DD
    completions: {
      "addition": 3,      // levelId -> số lần hoàn thành
      "comparison": 2
    }
  }
  ```

- **Auto-reset**: Tự động xóa dữ liệu cũ khi sang ngày mới

#### Các phương thức chính

- `getTodayCompletionCount(levelId: string)`: Lấy số lần hoàn thành của một level hôm nay
- `isCompletedToday(levelId: string)`: Kiểm tra xem level đã hoàn thành hôm nay chưa
- `incrementCompletion(levelId: string)`: Tăng số lần hoàn thành lên 1
- `resetProgress()`: Reset toàn bộ dữ liệu (dùng cho testing)

### 2. UI Components

#### Math Modules Component

**File**: `src/app/features/math-modules/math-modules.component.html`

Hiển thị 2 loại badge:

1. **Checkmark Badge** (góc trên bên trái):
   - Hiển thị dấu ✓ màu xanh lá
   - Chỉ xuất hiện khi level đã hoàn thành ít nhất 1 lần hôm nay
   - Có animation bounce nhẹ

2. **Completion Count Badge** (góc dưới bên phải):
   - Hiển thị icon 🔥 và số lần hoàn thành (ví dụ: "🔥 3x")
   - Gradient màu cam-hồng
   - Chỉ xuất hiện khi có ít nhất 1 lần hoàn thành

#### Game Components

**Files**:

- `src/app/features/math-modules/addition/addition.component.ts`
- `src/app/features/math-modules/comparison/comparison.component.ts`

Mỗi khi người dùng hoàn thành một bài học:

1. Gọi `dailyProgress.incrementCompletion(levelId)` để tăng số đếm
2. Hiển thị thông báo kèm số lần hoàn thành trong mascot message

## Cách sử dụng

### Trong Component

```typescript
import { DailyProgressService } from '../../core/services/daily-progress.service';

export class MyComponent {
  dailyProgress = inject(DailyProgressService);

  finishGame() {
    // Increment count
    this.dailyProgress.incrementCompletion('addition');
    
    // Get count for display
    const count = this.dailyProgress.getTodayCompletionCount('addition');
    console.log(`Completed ${count} times today!`);
  }
}
```

### Trong Template

```html
<!-- Check if completed today -->
<div *ngIf="dailyProgress.isCompletedToday(level.id)">
  ✓ Đã hoàn thành hôm nay
</div>

<!-- Show completion count -->
<div *ngIf="dailyProgress.getTodayCompletionCount(level.id) > 0">
  🔥 {{ dailyProgress.getTodayCompletionCount(level.id) }}x
</div>
```

## Animations

**File**: `src/app/features/math-modules/math-modules.component.css`

```css
@keyframes bounce-slow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.animate-bounce-slow {
    animation: bounce-slow 2s ease-in-out infinite;
}
```

## Testing

Để test tính năng reset hàng ngày:

1. Hoàn thành một bài học
2. Mở DevTools Console
3. Chạy lệnh:

   ```javascript
   localStorage.setItem('daily_progress', JSON.stringify({
     date: '2026-01-10',  // Ngày hôm qua
     completions: { 'addition': 5 }
   }));
   ```

4. Refresh trang - dữ liệu sẽ tự động reset

## Lưu ý

- Dữ liệu chỉ lưu trên client-side (localStorage)
- Nếu xóa localStorage hoặc đổi trình duyệt, dữ liệu sẽ mất
- Để đồng bộ giữa các thiết bị, cần tích hợp với backend API
