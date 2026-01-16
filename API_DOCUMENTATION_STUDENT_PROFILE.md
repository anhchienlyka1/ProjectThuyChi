# API Documentation - Student Profile (Hồ Sơ Của Bé)

## Tổng quan

API này được xây dựng để phục vụ màn hình "Hồ Sơ Của Bé" trong Parent Dashboard, hiển thị thông tin chi tiết về học sinh bao gồm:

- Thông tin cơ bản (tên, avatar, level, sao)
- Tiến độ XP
- Thống kê học tập hôm nay
- Phiếu Bé Ngoan (Achievements)

## Backend APIs

### 1. GET /student-profile/:userId

Lấy thông tin tổng quan về học sinh

**Response:**

```json
{
  "student": {
    "id": "string",
    "name": "string",
    "avatar": "string",
    "level": number,
    "totalStars": number,
    "xp": {
      "current": number,
      "currentLevelProgress": number,
      "xpNeededForNextLevel": number,
      "percentage": number
    }
  },
  "todayStats": {
    "lessonsCompleted": number,
    "correctAnswers": number,
    "minutesLearned": number
  }
}
```

**Ví dụ:**

```bash
GET http://localhost:3000/student-profile/user-123
```

### 2. GET /student-profile/:userId/achievements

Lấy danh sách tất cả Phiếu Bé Ngoan của học sinh

**Query Parameters:**

- `limit` (optional): Số lượng phiếu tối đa trả về

**Response:**

```json
[
  {
    "id": number,
    "achievementId": "string",
    "title": "string",
    "description": "string",
    "icon": "string",
    "rarity": "common|rare|epic|legendary",
    "earnedAt": "Date",
    "earnedContext": {}
  }
]
```

**Ví dụ:**

```bash
GET http://localhost:3000/student-profile/user-123/achievements?limit=10
```

### 3. GET /student-profile/:userId/weekly-achievements

Lấy danh sách Phiếu Bé Ngoan trong tuần hiện tại

**Response:**

```json
[
  {
    "id": number,
    "title": "string",
    "description": "string",
    "icon": "string",
    "earnedAt": "Date",
    "weekNumber": number
  }
]
```

**Ví dụ:**

```bash
GET http://localhost:3000/student-profile/user-123/weekly-achievements
```

## Frontend Integration

### Service: StudentProfileService

Location: `FE/src/app/core/services/student-profile.service.ts`

**Methods:**

```typescript
// Lấy thông tin profile
getStudentProfile(userId: string): Promise<StudentProfileResponse>

// Lấy tất cả achievements
getStudentAchievements(userId: string, limit?: number): Promise<Achievement[]>

// Lấy achievements tuần này
getWeeklyAchievements(userId: string): Promise<WeeklyAchievement[]>
```

### Component: StudentProfileCardComponent

Location: `FE/src/app/shared/components/student-profile-card/student-profile-card.component.ts`

**Usage:**

```html
<app-student-profile-card [studentId]="selectedStudent()!.id"></app-student-profile-card>
```

**Features:**

- Hiển thị avatar, tên, level, số sao
- Progress bar XP với phần trăm tiến độ
- 3 thẻ thống kê: Bài học hôm nay, Câu trả lời đúng, Phút học tập
- Danh sách Phiếu Bé Ngoan trong tuần
- Nút "Xem tất cả phiếu" để load toàn bộ achievements

## Cấu trúc Database

### Tables sử dụng

1. **users** - Thông tin học sinh
2. **user_progress** - Tiến độ học tập (stars)
3. **learning_sessions** - Lịch sử học tập
4. **achievements** - Định nghĩa các loại phiếu
5. **user_achievements** - Phiếu đã đạt được

## Công thức tính toán

### Level Calculation

```typescript
Level = floor(sqrt(totalXP / 100)) + 1
XP for Level N = (N - 1)² × 100
```

**Ví dụ:**

- Level 1: 0 XP
- Level 2: 100 XP
- Level 3: 400 XP
- Level 4: 900 XP

### XP Calculation

```typescript
totalXP = sum(all stars) × 10
// Mỗi sao = 10 XP
```

## Files Created/Modified

### Backend

1. ✅ `BE/src/application/services/student-profile.service.ts` - Service logic
2. ✅ `BE/src/presentation/controllers/student-profile.controller.ts` - API endpoints
3. ✅ `BE/src/modules/student-profile.module.ts` - Module configuration
4. ✅ `BE/src/app.module.ts` - Registered new module

### Frontend

1. ✅ `FE/src/app/core/services/student-profile.service.ts` - API client
2. ✅ `FE/src/app/shared/components/student-profile-card/student-profile-card.component.ts` - UI component
3. ✅ `FE/src/app/features/parent-dashboard/parent-dashboard.component.ts` - Added import
4. ✅ `FE/src/app/features/parent-dashboard/parent-dashboard.component.html` - Added component

## Testing

### Test API với curl

```bash
# Get student profile
curl http://localhost:3000/student-profile/YOUR_USER_ID

# Get all achievements
curl http://localhost:3000/student-profile/YOUR_USER_ID/achievements

# Get weekly achievements
curl http://localhost:3000/student-profile/YOUR_USER_ID/weekly-achievements
```

### Test trong browser

1. Đảm bảo backend đang chạy: `npm run start` trong thư mục BE
2. Đảm bảo frontend đang chạy: `ng serve` trong thư mục FE
3. Truy cập Parent Dashboard và chọn một học sinh
4. Component sẽ tự động load dữ liệu từ API

## Notes

- API sử dụng TypeORM với PostgreSQL
- Frontend sử dụng Angular Signals cho reactive state
- Component sử dụng Tailwind CSS cho styling
- Tất cả API calls đều async/await
- Error handling đã được implement
