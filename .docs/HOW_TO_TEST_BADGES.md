# 🧪 Hướng Dẫn Kiểm Tra Badges Hoàn Thành

## Cách 1: Hoàn Thành Bài Học Thực Tế (Khuyến Nghị)

1. **Mở ứng dụng**: <http://192.168.31.77:4200/>
2. **Đăng nhập** (nếu cần)
3. **Chọn môn học**: Toán hoặc Tiếng Việt
4. **Chọn một bài học**: Ví dụ "Phép Cộng" hoặc "So Sánh"
5. **Hoàn thành bài học**: Làm đủ số câu hỏi và đạt điểm
6. **Quay lại màn hình chọn bài**: Bấm nút "Quay lại"
7. **Quan sát badges**:
   - ✅ Badge ✓ xanh lá ở góc trên trái (đã hoàn thành hôm nay)
   - 🔥 Badge "1x" ở góc dưới trái (hoàn thành 1 lần)
8. **Làm lại bài học** để thấy badge tăng lên "2x", "3x"...

## Cách 2: Thêm Dữ Liệu Test Vào Database (Nhanh)

### Option A: Sử dụng Backend API

Gọi API để tạo session hoàn thành:

```bash
# PowerShell
$body = @{
    userId = "demo-user-id"
    levelId = "level-1"  # Hoặc ID của bài học bất kỳ
    score = 8
    totalQuestions = 10
    durationSeconds = 120
    answers = @()
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/learning/complete" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

### Option B: Thêm Trực Tiếp Vào Database

```sql
-- Kết nối vào MySQL
USE thuychi_db;

-- Thêm một learning session hoàn thành hôm nay
INSERT INTO learning_sessions (
    id, userId, levelId, startedAt, completedAt, 
    durationSeconds, score, totalQuestions, accuracyPercentage, 
    completed, createdAt, updatedAt
) VALUES (
    UUID(),
    (SELECT id FROM users WHERE email = 'demo@thuychi.com' LIMIT 1),
    'level-1',  -- Thay bằng ID bài học thực tế
    NOW() - INTERVAL 5 MINUTE,
    NOW(),
    300,
    8,
    10,
    80.0,
    1,
    NOW(),
    NOW()
);
```

## Cách 3: Mock Data Tạm Thời (Development Only)

Sửa file `daily-progress.service.ts` để trả về dữ liệu test:

```typescript
// Trong method loadTodayCompletions(), thêm dòng này sau line 43:
console.log('[DailyProgress] Loading completions from API...');

// MOCK DATA FOR TESTING - XÓA SAU KHI TEST XONG
const mockData: DailyCompletionsResponse = {
  date: this.getTodayString(),
  completions: {
    'level-1': 3,  // Phép Cộng - hoàn thành 3 lần
    'level-2': 1,  // So Sánh - hoàn thành 1 lần
    'level-3': 2   // Phép Trừ - hoàn thành 2 lần
  }
};
this.completionsCache$.next(mockData);
return of(mockData);
// END MOCK DATA
```

## ✅ Kết Quả Mong Đợi

Sau khi có dữ liệu hoàn thành, bạn sẽ thấy:

### Bài Học Đã Hoàn Thành 1 Lần

- ✅ Badge ✓ xanh lá (góc trên trái) - có hiệu ứng glow
- 🔥 Badge "1x" (góc dưới trái) - gradient cam-hồng

### Bài Học Đã Hoàn Thành 3 Lần

- ✅ Badge ✓ xanh lá (góc trên trái)
- 🔥 Badge "3x" (góc dưới trái) - hiển thị số lần

### Bài Học Chưa Hoàn Thành

- Không có badge nào
- Chỉ có badge số thứ tự (góc trên phải)

## 🐛 Troubleshooting

### Badges vẫn không hiển thị sau khi hoàn thành

1. **Kiểm tra console log**: Mở F12 → Console, xem có log `[DailyProgress]`
2. **Kiểm tra API response**: Xem API có trả về đúng dữ liệu không
3. **Hard reload**: Ctrl + Shift + R hoặc Ctrl + F5
4. **Clear cache**: Xóa localStorage và reload lại

### Lỗi "Invalid URL"

- Đây là lỗi Vite, không ảnh hưởng đến badges
- Reload lại trang là được

### Backend không chạy

```bash
cd BE
npm run start:dev
```

---

**Lưu Ý**: Badges được thiết kế để chỉ hiển thị khi có dữ liệu thực tế. Đây là tính năng, không phải bug!
