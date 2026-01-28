# 🔥 Firebase Backend Migration Guide

## ✅ Đã hoàn thành

### Services đã tạo/refactor

1. **✅ learning-session.service.ts** - Service lưu session học tập
   - Lưu kết quả mỗi bài học vào Firestore
   - Tự động tính XP và stars
   - Cập nhật daily progress

2. **✅ daily-progress.service.ts** - Đã refactor để dùng Firestore
   - Không còn dùng HTTP backend
   - Lưu/đọc progress từ Firestore
   - Cache để tối ưu performance

3. **✅ firestore.service.ts** - Enhanced với `setDocument()`
   - Hỗ trợ custom document ID (cho daily_progress)

## 📋 Firestore Collections

### Collections đã sẵn sàng sử dụng:

```
users/
  └── {userId}
      ├── username: string
      ├── fullName: string
      ├── level: number
      ├── xp: number
      ├── totalStars: number
      └── ...

learning_sessions/
  └── {sessionId}
      ├── userId: string
      ├── levelId: string
      ├── subject: 'math' | 'vietnamese' | 'english'
      ├── score: number
      ├── correctAnswers: number
      ├── xpEarned: number
      ├── starsEarned: number
      └── completedAt: timestamp

daily_progress/
  └── {userId}_{date}
      ├── userId: string
      ├── date: '2026-01-28'
      ├── lessonsCompleted: number
      ├── correctAnswers: number
      ├── minutesLearned: number
      ├── xpEarned: number
      ├── starsEarned: number
      └── completions: { levelId: count }
```

## 🚀 Cách sử dụng

### 1. Lưu kết quả học tập

```typescript
import { LearningSessionService } from './core/services/learning-session.service';

export class MyLessonComponent {
  constructor(private sessionService: LearningSessionService) {}

  async finishLesson() {
    await this.sessionService.completeSession({
      levelId: 'math-addition-1',
      subject: 'math',
      moduleType: 'addition',
      score: 90,
      totalQuestions: 10,
      correctAnswers: 9,
      duration: 120 // seconds
    });
    
    // Tự động:
    // ✅ Lưu session vào Firestore
    // ✅ Cộng XP cho user (9 x 10 = 90 XP)
    // ✅ Cộng stars (90 / 20 = 4 stars)
    // ✅ Cập nhật daily progress
    // ✅ Tăng level nếu đủ XP
  }
}
```

### 2. Kiểm tra đã học hôm nay chưa

```typescript
import { DailyProgressService } from './core/services/daily-progress.service';

export class LessonComponent {
  constructor(private progressService: DailyProgressService) {}

  ngOnInit() {
    const count = this.progressService.getTodayCompletionCount('math-addition-1');
    console.log(`Đã làm ${count} lần hôm nay`);
    
    const completed = this.progressService.isCompletedToday('math-addition-1');
    if (completed) {
      console.log('Đã hoàn thành bài này hôm nay!');
    }
  }
}
```

### 3. Xem progress hôm nay

```typescript
async showTodayProgress() {
  const progress = await this.progressService.getTodayProgress();
  console.log('Hôm nay đã học:');
  console.log(`- ${progress.lessonsCompleted} bài`);
  console.log(`- ${progress.correctAnswers}/${progress.totalQuestions} câu đúng`);
  console.log(`- ${progress.minutesLearned} phút`);
  console.log(`- +${progress.xpEarned} XP`);
  console.log(`- +${progress.starsEarned} ⭐`);
}
```

### 4. Xem lịch sử học tập

```typescript
import { LearningSessionService } from './core/services/learning-session.service';

async showHistory() {
  const history = await this.sessionService.getLearningHistory(userId, 10);
  history.forEach(session => {
    console.log(`${session.date}: ${session.subject} - ${session.score}% (+${session.xpEarned} XP)`);
  });
}
```

## 📝 Các bước tiếp theo

### Bước 1: Enable Firebase Authentication ⚠️ **BẮT BUỘC**

1. Vào Firebase Console: https://console.firebase.google.com/project/turing-link-205616
2. **Build** → **Authentication** → **Get Started**
3. Enable **Anonymous** authentication

### Bước 2: Setup Firestore Security Rules

1. Vào **Firestore Database** → **Rules**
2. Paste rules sau:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users
    match /users/{userId} {
      allow read: if true;
      allow write: if true; // Tạm thời cho phép tất cả, sẽ bảo mật sau
    }
    
    // Learning sessions
    match /learning_sessions/{sessionId} {
      allow read, write: if true;
    }
    
    // Daily progress
    match /daily_progress/{progressId} {
      allow read, write: if true;
    }
  }
}
```

3. Click **Publish**

### Bước 3: Tạo user test data (Optional)

Vào Firestore Database → **Start collection** → **users**

Tạo document với ID = `student1`:

```json
{
  "username": "student1",
  "fullName": "Nguyễn Văn A",
  "pinCode": "1234",
  "role": "student",
  "level": 1,
  "xp": 0,
  "totalStars": 0,
  "avatarUrl": "assets/avatars/boy1.png",
  "gender": "male"
}
```

### Bước 4: Test trong components

Bây giờ bạn có thể test trong components:

```typescript
// Trong bất kỳ component nào sau khi hoàn thành bài học
await this.sessionService.completeSession({
  levelId: 'test-level-1',
  subject: 'math',
  moduleType: 'addition',
  score: 100,
  totalQuestions: 5,
  correctAnswers: 5,
  duration: 60
});
```

Sau đó kiểm tra Firestore Console sẽ thấy:
- Collection `learning_sessions` có session mới
- Collection `daily_progress` được cập nhật
- User's XP & stars tăng lên

## ⚠️ Migration Notes

### Services chưa migrate (vẫn dùng mock data):

- `auth.service.ts` - Vẫn dùng localStorage và mock data
- `student-profile.service.ts` - Vẫn dùng mock data
- `achievement.service.ts` - Vẫn dùng mock data

**Lý do:** Các services này cần migrate authentication trước. Tôi sẽ làm sau khi bạn enable Firebase Authentication.

### Compatibility

Services hiện tại vẫn hoạt động bình thường với mock data. Khi có dữ liệu thật trong Firestore, services mới sẽ tự động sử dụng.

## 🎯 Benefits

✅ **Không cần backend server** - Mọi thứ chạy trên Firebase  
✅ **Realtime sync** - Dữ liệu đồng bộ tự động  
✅ **Offline support** - Firebase cache dữ liệu locally  
✅ **Scalable** - Tự động scale theo users  
✅ **Free tier** - 1GB storage + 50K reads/day miễn phí

## 📊 Monitoring

Xem usage tại:
- Firebase Console → **Firestore Database** → **Usage**
- Xem tất cả collections, documents
- Monitor reads/writes/deletes

---

**✨ Bây giờ bạn có thể lưu kết quả học tập vào Firestore rồi!**

Còn câu hỏi gì không?
