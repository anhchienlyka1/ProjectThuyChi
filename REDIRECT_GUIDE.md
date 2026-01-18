# Hướng Dẫn Redirect Khi Truy Cập Trái Phép

## 🎯 Hành Vi Hiện Tại

Khi người dùng **cố tình gõ URL** mà không có quyền truy cập, hệ thống sẽ **luôn redirect về trang `/home`**.

## 📍 Các Kịch Bản

### 1. Chưa đăng nhập, gõ URL của route được bảo vệ

```text
❌ Gõ: http://localhost:4200/math
✅ Redirect: http://localhost:4200/home
```

```text
❌ Gõ: http://localhost:4200/profile
✅ Redirect: http://localhost:4200/home
```

```text
❌ Gõ: http://localhost:4200/games/tug-of-war
✅ Redirect: http://localhost:4200/home
```

### 2. Student cố truy cập trang Parent

```text
❌ Student gõ: http://localhost:4200/parents
✅ Redirect: http://localhost:4200/home
```

### 3. Parent cố truy cập trang Student

```text
❌ Parent gõ: http://localhost:4200/math
✅ Redirect: http://localhost:4200/home
```

## ✅ Routes Được Phép Truy Cập Không Cần Login

Chỉ có **2 routes** cho phép truy cập mà không cần đăng nhập:

1. **`/home`** - Trang chủ (hiển thị nút đăng nhập)
2. **`/login`** - Trang đăng nhập

Tất cả các route khác đều yêu cầu đăng nhập với role phù hợp.

## 🔒 Cách Hoạt Động

### Frontend Guards

#### StudentGuard

- **Áp dụng cho**: Tất cả routes trong child layout
- **Cho phép**: `/home`, `/login`, `/` (root)
- **Yêu cầu login**: Tất cả routes khác (`/math`, `/profile`, `/games`, etc.)
- **Redirect nếu không có quyền**: → `/home`

#### AuthGuard

- **Áp dụng cho**: Routes trong parent layout (`/parents/*`)
- **Yêu cầu**: User phải có role `parent`
- **Redirect nếu không có quyền**: → `/home`

### Backend Protection

Tất cả API endpoints quan trọng đều được bảo vệ bởi `JwtAuthGuard`:

```text
❌ Gọi API không có token
→ Trả về: 401 Unauthorized
```

## 💡 Lợi Ích

1. **Trải nghiệm người dùng tốt hơn**: Luôn redirect về một trang quen thuộc (`/home`)
2. **Bảo mật**: Không cho phép truy cập trái phép
3. **Đơn giản**: Người dùng luôn biết họ sẽ được đưa về đâu
4. **Linh hoạt**: Trang home có thể hiển thị các tùy chọn đăng nhập phù hợp

## 🚀 Cách Test

### Test 1: Truy cập route được bảo vệ

1. Mở trình duyệt ở chế độ ẩn danh
2. Gõ: `http://localhost:4200/math`
3. Kết quả: Tự động chuyển về `http://localhost:4200/home`

### Test 2: Truy cập route của Parent

1. Đăng nhập với tài khoản Student
2. Gõ: `http://localhost:4200/parents`
3. Kết quả: Tự động chuyển về `http://localhost:4200/home`

### Test 3: Truy cập home và login

1. Mở trình duyệt ẩn danh
2. Gõ: `http://localhost:4200/home` → ✅ Vào được
3. Gõ: `http://localhost:4200/login` → ✅ Vào được

## 📝 Ghi Chú

- Trang `/home` nên có nút "Đăng nhập" rõ ràng để người dùng biết cách tiếp tục
- Có thể thêm thông báo "Vui lòng đăng nhập để tiếp tục" khi redirect từ route được bảo vệ
- Backend API vẫn được bảo vệ độc lập, không phụ thuộc vào frontend routing
