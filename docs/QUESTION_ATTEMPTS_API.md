# Question Attempts API Documentation

## Tổng Quan

API này cho phép lưu trữ và phân tích chi tiết từng câu hỏi mà bé đã làm trong mỗi phiên học.

## Endpoints

### 1. Lưu 1 Câu Hỏi (Realtime)

**POST** `/question-attempts`

Lưu chi tiết 1 câu hỏi ngay khi bé trả lời (realtime tracking).

**Request Body:**

```json
{
  "sessionId": 123,
  "questionId": 45,
  "questionNumber": 1,
  "questionText": "5 + 3 = ?",
  "userAnswer": "8",
  "correctAnswer": "8",
  "isCorrect": true,
  "timeSpentSeconds": 5,
  "attemptsCount": 1
}
```

**Response:**

```json
{
  "id": 456,
  "sessionId": 123,
  "questionNumber": 1,
  "questionText": "5 + 3 = ?",
  "userAnswer": "8",
  "correctAnswer": "8",
  "isCorrect": true,
  "timeSpentSeconds": 5,
  "attemptsCount": 1,
  "answeredAt": "2026-01-11T02:40:00.000Z"
}
```

---

### 2. Lưu Nhiều Câu Cùng Lúc

**POST** `/question-attempts/bulk`

Lưu tất cả câu hỏi khi hoàn thành session (batch insert).

**Request Body:**

```json
{
  "sessionId": 123,
  "attempts": [
    {
      "questionId": 45,
      "questionNumber": 1,
      "questionText": "5 + 3 = ?",
      "userAnswer": "8",
      "correctAnswer": "8",
      "isCorrect": true,
      "timeSpentSeconds": 5
    },
    {
      "questionId": 46,
      "questionNumber": 2,
      "questionText": "7 + 2 = ?",
      "userAnswer": "8",
      "correctAnswer": "9",
      "isCorrect": false,
      "timeSpentSeconds": 10
    }
  ]
}
```

**Response:**

```json
[
  { "id": 456, "questionNumber": 1, ... },
  { "id": 457, "questionNumber": 2, ... }
]
```

---

### 3. Xem Chi Tiết 1 Phiên Học

**GET** `/question-attempts/session/:sessionId`

Lấy tất cả câu hỏi trong 1 phiên học cụ thể.

**Example:**

```
GET /question-attempts/session/123
```

**Response:**

```json
[
  {
    "id": 456,
    "sessionId": 123,
    "questionNumber": 1,
    "questionText": "5 + 3 = ?",
    "userAnswer": "8",
    "correctAnswer": "8",
    "isCorrect": true,
    "timeSpentSeconds": 5,
    "answeredAt": "2026-01-11T02:40:00.000Z"
  },
  {
    "id": 457,
    "sessionId": 123,
    "questionNumber": 2,
    "questionText": "7 + 2 = ?",
    "userAnswer": "8",
    "correctAnswer": "9",
    "isCorrect": false,
    "timeSpentSeconds": 10,
    "answeredAt": "2026-01-11T02:40:10.000Z"
  }
]
```

---

### 4. Xem Tất Cả Attempts của User

**GET** `/question-attempts/user/:userId?limit=100`

Lấy lịch sử tất cả câu hỏi mà user đã làm.

**Example:**

```
GET /question-attempts/user/1?limit=50
```

**Response:**

```json
[
  {
    "id": 789,
    "questionText": "CÁ",
    "userAnswer": "Á",
    "correctAnswer": "Á",
    "isCorrect": true,
    "timeSpentSeconds": 8,
    "answeredAt": "2026-01-11T02:35:00.000Z"
  },
  ...
]
```

---

### 5. Phân Tích Câu Nào Bé Hay Sai ⭐

**GET** `/question-attempts/analysis/:userId?levelId=spelling`

Phân tích chi tiết câu nào bé hay sai, tỷ lệ đúng/sai, thời gian trung bình.

**Example:**

```
GET /question-attempts/analysis/1?levelId=spelling
```

**Response:**

```json
[
  {
    "questionText": "BÀ",
    "totalAttempts": 5,
    "correctAttempts": 2,
    "wrongAttempts": 3,
    "successRate": 40,
    "averageTimeSpent": 12.5,
    "commonWrongAnswers": []
  },
  {
    "questionText": "CÁ",
    "totalAttempts": 3,
    "correctAttempts": 3,
    "wrongAttempts": 0,
    "successRate": 100,
    "averageTimeSpent": 5.2,
    "commonWrongAnswers": []
  }
]
```

**Sắp xếp:** Câu sai nhiều nhất → ít nhất (để phụ huynh biết cần ôn lại)

---

### 6. Xem Câu Trả Lời Sai Phổ Biến

**GET** `/question-attempts/wrong-answers/:userId?questionText=BÀ`

Xem các câu trả lời sai phổ biến cho 1 câu hỏi cụ thể.

**Example:**

```
GET /question-attempts/wrong-answers/1?questionText=BÀ
```

**Response:**

```json
[
  { "answer": "BÁ", "count": 2 },
  { "answer": "BA", "count": 1 }
]
```

---

### 7. Thống Kê Tổng Quan

**GET** `/question-attempts/stats/:userId`

Thống kê tổng quan về hiệu suất học tập.

**Example:**

```
GET /question-attempts/stats/1
```

**Response:**

```json
{
  "totalQuestions": 150,
  "totalCorrect": 120,
  "totalWrong": 30,
  "accuracy": 80,
  "avgTimePerQuestion": 7.5
}
```

---

## Tích Hợp Tự Động

### Khi Hoàn Thành Session

API `POST /learning/complete` đã được cập nhật để **tự động lưu** `question_attempts`.

**Request Body (Updated):**

```json
{
  "userId": "demo-user-id",
  "levelId": "spelling",
  "score": 8,
  "totalQuestions": 10,
  "durationSeconds": 120,
  "answers": [
    {
      "questionId": 45,
      "questionText": "CÁ",
      "userAnswer": "Á",
      "correctAnswer": "Á",
      "isCorrect": true,
      "timeSpent": 5
    },
    {
      "questionId": 46,
      "questionText": "BÀ",
      "userAnswer": "BÁ",
      "correctAnswer": "À",
      "isCorrect": false,
      "timeSpent": 10
    }
  ]
}
```

**Hệ thống sẽ tự động:**

1. Lưu `learning_sessions`
2. Lưu từng câu vào `question_attempts` ✨ (NEW!)
3. Cập nhật `user_progress`

---

## Use Cases

### 1. Parent Dashboard - Xem Chi Tiết Phiên Học

```typescript
// Frontend: Khi click vào 1 session trong lịch sử
async viewSessionDetails(sessionId: number) {
  const attempts = await http.get(`/question-attempts/session/${sessionId}`);
  
  // Hiển thị:
  // ✅ Câu 1: 5 + 3 = 8 (Đúng, 5 giây)
  // ❌ Câu 2: 7 + 2 = 8 (Sai, đáp án đúng: 9, 10 giây)
  // ✅ Câu 3: 4 + 4 = 8 (Đúng, 3 giây)
}
```

### 2. Phân Tích Điểm Yếu

```typescript
// Frontend: Trang "Phân Tích Học Tập"
async analyzeWeakPoints(userId: number) {
  const analysis = await http.get(`/question-attempts/analysis/${userId}`);
  
  // Hiển thị:
  // 📊 Câu hay sai nhất:
  // 1. "BÀ" - Sai 3/5 lần (60% sai)
  // 2. "BÓNG" - Sai 2/4 lần (50% sai)
  
  // 💡 Gợi ý: Cần ôn lại dấu huyền và dấu sắc
}
```

### 3. Báo Cáo Tuần

```typescript
// Backend: Tạo báo cáo tự động
async generateWeeklyReport(userId: number) {
  const stats = await questionAttemptService.getOverallStats(userId);
  const weakPoints = await questionAttemptService.analyzeUserPerformance(userId);
  
  return {
    summary: `Bé đã làm ${stats.totalQuestions} câu, đúng ${stats.totalCorrect} câu (${stats.accuracy}%)`,
    weakPoints: weakPoints.slice(0, 5), // Top 5 câu hay sai
    recommendation: "Nên ôn lại phần đánh vần"
  };
}
```

---

## Database Schema

```sql
CREATE TABLE question_attempts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  session_id INT NOT NULL,
  question_id INT NULL,
  question_number INT NOT NULL,
  question_text TEXT NULL,
  user_answer VARCHAR(255) NULL,
  correct_answer VARCHAR(255) NULL,
  is_correct BOOLEAN NOT NULL,
  time_spent_seconds INT DEFAULT 0,
  attempts_count INT DEFAULT 1,
  answered_at DATETIME NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  
  FOREIGN KEY (session_id) REFERENCES learning_sessions(id),
  FOREIGN KEY (question_id) REFERENCES questions(id)
);
```

---

## Testing

### Test với Postman

1. **Tạo session:**

```bash
POST http://localhost:3000/learning/complete
{
  "userId": "demo-user-id",
  "levelId": "spelling",
  "score": 8,
  "totalQuestions": 10,
  "durationSeconds": 120,
  "answers": [...]
}
```

1. **Xem chi tiết:**

```bash
GET http://localhost:3000/question-attempts/session/{sessionId}
```

1. **Phân tích:**

```bash
GET http://localhost:3000/question-attempts/analysis/1?levelId=spelling
```

---

## Notes

- `questionId` có thể null (nếu câu hỏi được generate động)
- `questionText` luôn được lưu để tracking
- `attemptsCount` = số lần thử lại (nếu cho phép)
- Tự động soft delete khi xóa session
