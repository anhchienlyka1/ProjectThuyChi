# ✅ Fix: Sử Dụng User ID Thực Tế Từ LocalStorage

## 🐛 Vấn Đề

Các service đang hardcode `'demo-user-id'` thay vì lấy **user ID thực tế** từ localStorage sau khi user đăng nhập.

**Lỗi gặp phải:**

```json
{
  "statusCode": 500,
  "message": "Cannot add or update a child row: a foreign key constraint fails..."
}
```

**Nguyên nhân:** Backend không tìm thấy user với ID `'demo-user-id'` trong database.

## ✅ Giải Pháp

Cập nhật tất cả các service để sử dụng `AuthService.getUserId()` thay vì hardcode.

### Files Đã Sửa

#### 1. **daily-progress.service.ts**

```typescript
// TRƯỚC
{ params: { userId: 'demo-user-id' } }

// SAU
const userId = this.authService.getUserId();
if (!userId) {
  console.warn('[DailyProgress] No user logged in');
  return of(emptyData);
}
{ params: { userId } }
```

#### 2. **math-level.service.ts**

```typescript
// TRƯỚC
`${this.apiUrl}?subjectId=${subjectId}&userId=demo-user-id`

// SAU
const userId = this.authService.getUserId();
if (!userId) {
  console.warn('[MathLevelService] No user logged in');
  return of([]);
}
`${this.apiUrl}?subjectId=${subjectId}&userId=${userId}`
```

#### 3. **vietnamese-level.service.ts**

```typescript
// TRƯỚC
`${this.apiUrl}?subjectId=vietnamese&userId=demo-user-id`

// SAU
const userId = this.authService.getUserId();
if (!userId) {
  console.warn('[VietnameseLevelService] No user logged in');
  return of([]);
}
`${this.apiUrl}?subjectId=vietnamese&userId=${userId}`
```

#### 4. **learning.service.ts**

```typescript
// TRƯỚC
userId: result.userId || 'demo-user-id'

// SAU
const userId = result.userId || this.authService.getUserId();
if (!userId) {
  console.error('[LearningService] No user ID available');
  return throwError(() => new Error('User not logged in'));
}
```

## 🔄 Cách Hoạt Động

### 1. **User Login**

```typescript
// AuthService.login()
localStorage.setItem('thuyChi_user', JSON.stringify(user));
localStorage.setItem('thuyChi_token', token);
```

### 2. **AuthService Lưu User Info**

```typescript
// LocalStorage structure
{
  "thuyChi_user": {
    "id": "uuid-real-user-id",
    "username": "bé Minh",
    "fullName": "Nguyễn Văn Minh",
    "email": "beMinh@example.com",
    "role": "student"
  },
  "thuyChi_token": "jwt-token-here"
}
```

### 3. **Services Lấy User ID**

```typescript
// Tất cả services giờ gọi:
const userId = this.authService.getUserId();
// Returns: "uuid-real-user-id" (từ localStorage)
```

### 4. **API Calls Với User ID Đúng**

```typescript
// GET /levels?subjectId=math&userId=uuid-real-user-id
// GET /learning/daily-completions?userId=uuid-real-user-id
// POST /learning/complete { userId: "uuid-real-user-id", ... }
```

## ✅ Kết Quả

### Trước Fix

- ❌ API calls với `userId=demo-user-id`
- ❌ Backend không tìm thấy user
- ❌ Lỗi 500 Foreign Key Constraint
- ❌ Badges không hiển thị

### Sau Fix

- ✅ API calls với user ID thực tế từ localStorage
- ✅ Backend tìm thấy user đúng
- ✅ Lưu learning sessions thành công
- ✅ Badges hiển thị đúng sau khi hoàn thành bài học

## 🧪 Testing

### 1. **Kiểm Tra User ID**

```javascript
// Mở Console (F12) và chạy:
const user = JSON.parse(localStorage.getItem('thuyChi_user'));
console.log('User ID:', user?.id);
```

### 2. **Kiểm Tra API Calls**

```javascript
// Mở Network tab (F12)
// Làm một bài học
// Xem request POST /learning/complete
// Body phải có: { "userId": "uuid-real-id", ... }
```

### 3. **Kiểm Tra Badges**

1. Login vào app
2. Chọn môn học (Toán/Tiếng Việt)
3. Hoàn thành một bài học
4. Quay lại màn hình chọn bài
5. **Badges sẽ xuất hiện!** ✨

## 🔒 Security Note

- User ID được lưu trong localStorage (client-side)
- Backend vẫn cần validate user ID với token JWT
- Không nên tin tưởng hoàn toàn user ID từ client

## 📝 Summary

| Service | Thay Đổi | Status |
|---------|----------|--------|
| `daily-progress.service.ts` | ✅ Sử dụng `authService.getUserId()` | Done |
| `math-level.service.ts` | ✅ Sử dụng `authService.getUserId()` | Done |
| `vietnamese-level.service.ts` | ✅ Sử dụng `authService.getUserId()` | Done |
| `learning.service.ts` | ✅ Sử dụng `authService.getUserId()` | Done |

---

**Ngày cập nhật**: 2026-01-11  
**Version**: 1.0  
**Fix By**: Antigravity AI
