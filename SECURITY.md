# Hệ Thống Authentication & Authorization

## Tổng Quan

Hệ thống đã được tích hợp **Authentication (Xác thực)** và **Authorization (Phân quyền)** đầy đủ cho cả Backend (NestJS) và Frontend (Angular).

## 🔐 Backend Security

### 1. JWT Authentication

- **Thư viện**: `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`
- **Secret Key**: `super-secret-key-123` (⚠️ Cần đổi thành biến môi trường trong production)
- **Token Expiration**: 1 ngày

### 2. Guards & Decorators

#### JwtAuthGuard

- **File**: `src/infrastructure/auth/jwt-auth.guard.ts`
- **Chức năng**: Xác thực JWT token từ header `Authorization: Bearer <token>`
- **Sử dụng**: Thêm `@UseGuards(JwtAuthGuard)` vào controller hoặc route

#### RolesGuard

- **File**: `src/infrastructure/auth/roles.guard.ts`
- **Chức năng**: Kiểm tra role của user (student/parent)
- **Sử dụng**:

  ```typescript
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('parent')
  async getParentData() { ... }
  ```

### 3. Protected Controllers

Các controller sau đã được bảo vệ với `@UseGuards(JwtAuthGuard)`:

✅ **StudentProfileController** - `/student-profile/*`
✅ **DashboardController** - `/dashboard/*`
✅ **LearningController** - `/learning/*`
✅ **UserController** - `/users/*`

❌ **AuthController** - `/auth/*` (Không bảo vệ - cần cho login)

### 4. Ví Dụ Sử Dụng

```typescript
// Bảo vệ toàn bộ controller
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController { ... }

// Bảo vệ với role cụ thể
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('parent')
export class AdminController { ... }

// Bảo vệ từng route
@Get('sensitive-data')
@UseGuards(JwtAuthGuard)
async getSensitiveData() { ... }
```

## 🌐 Frontend Security

### 1. HTTP Interceptor

- **File**: `src/app/core/interceptors/auth.interceptor.ts`
- **Chức năng**: Tự động thêm JWT token vào header của mọi HTTP request
- **Đã đăng ký**: Trong `app.config.ts`

### 2. Route Guards

#### AuthGuard (Parent)

- **File**: `src/app/core/guards/auth.guard.ts`
- **Bảo vệ**: Routes dành cho phụ huynh (`/parents/*`)
- **Redirect**: Về `/home` nếu chưa đăng nhập (trang home sẽ hiển thị tùy chọn đăng nhập)

#### StudentGuard (Child)

- **File**: `src/app/core/guards/student.guard.ts`
- **Bảo vệ**: Tất cả routes của trẻ (trừ `/login`, `/home`, và `/`)
- **Cho phép truy cập**: `/home`, `/login` không cần đăng nhập
- **Redirect**: Về `/home` nếu cố truy cập các route khác mà chưa đăng nhập

### 3. Protected Routes

```typescript
// Routes của trẻ - Bảo vệ bởi StudentGuard
{
  path: '',
  canActivate: [StudentGuard],
  children: [
    { path: 'home', ... },        // ✅ Cho phép không cần login
    { path: 'login', ... },       // ✅ Cho phép không cần login
    { path: 'math', ... },        // 🔒 Yêu cầu login
    { path: 'profile', ... },     // 🔒 Yêu cầu login
    // ...
  ]
}

// Routes của phụ huynh - Bảo vệ bởi AuthGuard
{
  path: 'parents',
  canActivate: [AuthGuard],
  children: [
    { path: '', component: ParentDashboardComponent },
    { path: 'reports', ... }
  ]
}
```

## 🛡️ Kịch Bản Bảo Mật

### Scenario 1: Người dùng chưa đăng nhập gõ URL trực tiếp

**Frontend:**

```text
User gõ: http://localhost:4200/math
→ StudentGuard kiểm tra
→ Không có token hoặc role không phải 'student'
→ Redirect về: /home (trang home sẽ hiển thị nút đăng nhập)
```

**Backend:**

```text
User gọi API: GET /api/dashboard/overview
→ JwtAuthGuard kiểm tra header Authorization
→ Không có token hoặc token không hợp lệ
→ Trả về: 401 Unauthorized
```

### Scenario 2: Student cố truy cập route của Parent

**Frontend:**

```text
Student gõ: http://localhost:4200/parents
→ AuthGuard kiểm tra
→ User có role 'student', không phải 'parent'
→ Redirect về: /home
```

### Scenario 3: Sử dụng token hết hạn

**Backend:**

```text
User gọi API với token đã hết hạn
→ JwtStrategy kiểm tra token
→ Token expired
→ Trả về: 401 Unauthorized
```

**Frontend:**

```text
→ AuthInterceptor nhận 401
→ AuthService tự động logout
→ Redirect về /home
```

## ⚠️ Lưu Ý Quan Trọng

### 1. Secret Key

Hiện tại đang dùng hardcoded secret key. **Cần thay đổi**:

```typescript
// ❌ Hiện tại
secret: 'super-secret-key-123'

// ✅ Nên dùng
secret: process.env.JWT_SECRET
```

### 2. Token Storage

Token được lưu trong `localStorage`. Cân nhắc:

- **httpOnly cookies** cho bảo mật tốt hơn
- **Refresh token** mechanism

### 3. CORS

Đảm bảo backend có cấu hình CORS đúng:

```typescript
app.enableCors({
  origin: 'http://localhost:4200',
  credentials: true
});
```

## 📝 Checklist Triển Khai Production

- [ ] Chuyển JWT secret sang biến môi trường
- [ ] Cấu hình HTTPS
- [ ] Implement refresh token
- [ ] Thêm rate limiting
- [ ] Logging cho các lỗi authentication
- [ ] Implement password hashing (nếu dùng password thay vì PIN)
- [ ] Thêm CSRF protection
- [ ] Audit log cho các hành động quan trọng

## 🔧 Testing

### Test Authentication

```bash
# Login
curl -X POST http://localhost:3000/auth/login/student \
  -H "Content-Type: application/json" \
  -d '{"pinCode": "123456", "type": "student"}'

# Sử dụng token
curl -X GET http://localhost:3000/dashboard/overview?userId=xxx \
  -H "Authorization: Bearer <token>"
```

### Test Authorization

```bash
# Với token của student, gọi endpoint yêu cầu parent role
curl -X GET http://localhost:3000/admin/parent-only \
  -H "Authorization: Bearer <student_token>"
# Expected: 403 Forbidden
```

## 📚 Tài Liệu Tham Khảo

- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [Angular Route Guards](https://angular.dev/guide/routing/common-router-tasks#preventing-unauthorized-access)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
