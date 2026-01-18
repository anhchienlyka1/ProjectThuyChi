# Test Phiếu Bé Ngoan - Môn Toán

## Cách Test

### 1. Kiểm Tra Backend Log

Khi bạn hoàn thành bài toán, backend sẽ log ra:

```
🎖️ Awarding math lesson completion certificate...
✨ Math lesson achievement awarded!
```

### 2. Kiểm Tra Response từ API

Khi gọi API `POST /api/learning/complete-session`, response sẽ có:

```json
{
  "success": true,
  "starsEarned": 3,
  "newHighScore": true,
  "accuracy": 100,
  "sessionId": 123,
  "completed": true,
  "improvementAchievement": {
    "id": "math-lesson-completion",
    "title": "Phiếu Bé Ngoan - Toán Học",
    "description": "Hoàn thành tất cả bài tập Toán Học",
    "icon": "🎖️",
    "rarity": "epic",
    "points": 10
  }
}
```

### 3. Kiểm Tra Frontend

Sau khi hoàn thành bài:

1. **Màn hình kết quả** hiển thị (2 giây)
2. **Achievement notification** hiển thị sau 5 giây
3. Phiếu có:
   - Tiêu đề: "Phiếu Bé Ngoan - Toán Học"
   - Icon: 🎖️
   - Màu: Xanh lá (epic rarity)
   - Điểm: +10

### 4. Debug Steps

Nếu không thấy phiếu:

#### A. Kiểm tra Backend

```bash
# Xem log backend
cd d:\ThuyChi\ProjectThuyChi\be
npm run start
```

Tìm các dòng log:

- `🎖️ Awarding math lesson completion certificate...`
- `✨ Math lesson achievement awarded!`
- `⚠️ Failed to award math lesson achievement`

#### B. Kiểm tra Frontend Console

Mở Developer Tools (F12) và xem:

```javascript
// Trong console, sau khi hoàn thành bài
// Kiểm tra response
console.log(response.improvementAchievement);
```

#### C. Kiểm tra Database

```sql
-- Xem achievement đã được tạo chưa
SELECT * FROM achievements WHERE achievementId = 'math-lesson-completion';

-- Xem user đã nhận achievement chưa
SELECT * FROM user_achievements 
WHERE achievementId = (
  SELECT id FROM achievements WHERE achievementId = 'math-lesson-completion'
)
ORDER BY earnedAt DESC
LIMIT 10;
```

### 5. Điều Kiện Trao Phiếu

✅ **Được trao khi:**

- Hoàn thành bài toán (bất kỳ bài nào: addition, subtraction, comparison, v.v.)
- Đạt ít nhất 1 sao (≥50% đúng)
- SubjectId = 'math'

❌ **KHÔNG được trao khi:**

- Đạt 0 sao (<50% đúng)
- Không phải môn toán
- Backend lỗi

### 6. Các Bài Toán Áp Dụng

Phiếu Bé Ngoan - Toán Học được trao cho TẤT CẢ các bài toán:

- ✅ Phép Cộng (addition)
- ✅ Phép Trừ (subtraction)
- ✅ So Sánh (comparison)
- ✅ Điền Số (fill-in-blank)
- ✅ Sắp Xếp (sorting)

---

## Troubleshooting

### Vấn đề: Không thấy phiếu bé ngoan

**Giải pháp:**

1. **Restart Backend**

   ```bash
   # Stop backend (Ctrl+C)
   # Start lại
   npm run start
   ```

2. **Clear Browser Cache**
   - F12 → Network tab → Disable cache
   - Hoặc Ctrl+Shift+R để hard reload

3. **Kiểm tra Achievement Service**

   ```typescript
   // File: BE/src/application/services/achievement.service.ts
   // Method: awardAchievement
   // Đảm bảo không có lỗi khi trao achievement
   ```

4. **Kiểm tra Database Seed**

   ```bash
   cd d:\ThuyChi\ProjectThuyChi\be
   npm run seed
   ```

### Vấn đề: Phiếu hiển thị nhưng không đúng màu

**Giải pháp:**

- Kiểm tra `rarity` trong database phải là `'epic'`
- Component `AchievementNotificationComponent` sẽ tự động map rarity → màu sắc

### Vấn đề: Mỗi lần làm bài đều nhận phiếu mới

**Đây là hành vi ĐÚNG!**

- Logic hiện tại: Mỗi lần hoàn thành = 1 phiếu mới
- Nếu muốn giới hạn (ví dụ: 1 phiếu/bài/ngày), cần thêm logic check trong `AchievementService`

---

**Cập nhật**: 2026-01-17 17:00
**Status**: ✅ Code đã được cập nhật, đang chờ test
