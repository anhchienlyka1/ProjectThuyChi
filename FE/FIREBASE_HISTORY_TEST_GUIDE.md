# ✅ Kiểm tra lưu History Học tập vào Firebase

## Thay đổi đã thực hiện

**File:** `learning.service.ts`

- ✅ Tích hợp với `LearningSessionService` để lưu vào Firestore
- ✅ Tự động phát hiện `subject` và `moduleType` từ `levelId`
- ✅ Tính toán `correctAnswers`, `accuracy`, `stars` tự động
- ✅ Lưu vào Firestore + mock data (backward compatible)
- ✅ Tự động refresh daily progress sau khi hoàn thành

## Cách test

### Bước 1: Build & Deploy phiên bản mới

```bash
cd /Users/pcc/ProjectThuyChi/FE
npm run deploy:full
```

### Bước 2: Tạo user test trong Firestore

1. Vào Firebase Console: https://console.firebase.google.com/project/turing-link-205616/firestore
2. Tab **Data**
3. Click **"+ Start collection"** (nếu chưa có collection `users`)
4. Collection ID: `users`
5. Click **Next**
6. Document ID: `student_test_001`
7. Thêm fields:

```
username: "test"
pinCode: "1234"
fullName: "Bé Test"
role: "student"
level: 1
xp: 0
totalStars: 0
gender: "male"
avatarUrl: "assets/avatars/boy1.png"
```

8. Click **Save**

### Bước 3: Test trên web app

1. Vào: https://turing-link-205616.web.app
2. Đăng nhập với `test` / `1234`
3. Chọn môn học (Toán hoặc Tiếng Việt)
4. Hoàn thành 1 bài học bất kỳ

### Bước 4: Kiểm tra Firestore

Vào Firebase Console → **Firestore Database** → Tab **Data**

Bạn sẽ thấy:

#### Collection: `learning_sessions`

Mỗi bài học hoàn thành sẽ tạo 1 document mới:

```
{
  userId: "student_test_001"
  levelId: "math-addition-1" (hoặc tương tự)
  subject: "math"
  moduleType: "addition"
  score: 100 (phần trăm)
  totalQuestions: 5
  correctAnswers: 5
  xpEarned: 50 (= correctAnswers * 10)
  starsEarned: 5 (= score / 20)
  duration: 45 (seconds)
  date: "2026-01-28"
  completedAt: "2026-01-28T08:30:15.123Z"
  createdAt: "..."
  updatedAt: "..."
}
```

#### Collection: `daily_progress`

Document ID: `student_test_001_2026-01-28`

```
{
  userId: "student_test_001"
  date: "2026-01-28"
  lessonsCompleted: 1
  correctAnswers: 5
  totalQuestions: 5
  minutesLearned: 0
  xpEarned: 50
  starsEarned: 5
  completions: {
    "math-addition-1": 1
  }
  createdAt: "..."
  updatedAt: "..."
}
```

#### Collection: `users` (User được cập nhật)

Document ID: `student_test_001`

```
{
  ...
  xp: 50 (tăng từ 0)
  totalStars: 5 (tăng từ 0)
  level: 1 (có thể tăng nếu đủ XP)
  updatedAt: "..." (timestamp mới)
}
```

### Bước 5: Test nhiều sessions

Làm thêm vài bài học nữa và kiểm tra:

1. `learning_sessions` có thêm documents mới
2. `daily_progress` được update (số tăng lên)
3. User's XP và stars tăng dần

---

## Debug nếu không thấy data

### Mở Console trong DevTools

Ấn `F12` → Tab **Console**

Tìm các log:

```
[LearningService] Completing session: {...}
[LearningService] Session saved to Firestore successfully
[DailyProgress] Forcing refresh...
```

Nếu thấy lỗi màu đỏ → Copy error và báo lại.

### Kiểm tra Rules

Vào **Firestore Database** → Tab **Rules**

Đảm bảo có:

```javascript
allow read, write: if true;
```

---

## Các bài học được hỗ trợ

✅ **Toán:**
- Addition (Cộng)
- Subtraction (Trừ)
- Comparison (So sánh)
- Geometry (Hình học)
- Sorting (Sắp xếp)
- Fill-in-blank (Điền số)
- Mixed (Hỗn hợp)

✅ **Tiếng Việt:**
- Spelling (Chính tả)

Tất cả đều tự động lưu vào Firestore khi hoàn thành! 🎉

---

## Lưu ý

- Data sẽ lưu **REALTIME** (ngay lập tức)
- Mở 2 tab: 1 tab web app + 1 tab Firestore Console để xem live
- Nếu user chưa tồn tại trong Firestore, sẽ có warning nhưng vẫn track được (dùng localStorage tạm)

Hãy test và báo kết quả cho tôi! 🚀
