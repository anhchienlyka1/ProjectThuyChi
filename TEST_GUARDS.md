# Test Guards - Hướng Dẫn Kiểm Tra

## 🧪 Các Bước Test

### Bước 1: Xóa dữ liệu đã lưu

Mở Console (F12) và chạy:

```javascript
// Xóa tất cả dữ liệu đã lưu
localStorage.clear();
sessionStorage.clear();
console.log('✅ Đã xóa tất cả dữ liệu');

// Reload trang
location.reload();
```

### Bước 2: Test truy cập route được bảo vệ

Sau khi reload, gõ trực tiếp vào address bar:

```
http://localhost:4200/math
```

**Kết quả mong đợi:**

- Console hiển thị: `🔒 StudentGuard Check: { path: 'math', isAuthenticated: false, isStudent: false, currentUser: null }`
- Console hiển thị: `❌ Access denied, redirecting to /home`
- URL tự động chuyển về: `http://localhost:4200/home`

### Bước 3: Test các route khác

Thử các URL sau (đều phải redirect về `/home`):

```
http://localhost:4200/profile
http://localhost:4200/math/addition
http://localhost:4200/games/tug-of-war
http://localhost:4200/exam-practice
```

### Bước 4: Test route của Parent

```
http://localhost:4200/parents
```

**Kết quả mong đợi:**

- Console hiển thị: `🔒 AuthGuard (Parent) Check: { isAuthenticated: false, isParent: false, currentUser: null }`
- Console hiển thị: `❌ Parent access denied, redirecting to /home`
- URL tự động chuyển về: `http://localhost:4200/home`

### Bước 5: Test sau khi đăng nhập

1. Đăng nhập với tài khoản student
2. Thử truy cập: `http://localhost:4200/math`

**Kết quả mong đợi:**

- Console hiển thị: `🔒 StudentGuard Check: { path: 'math', isAuthenticated: true, isStudent: true, currentUser: {...} }`
- Console hiển thị: `✅ User authenticated as student, allowing access`
- Vào được trang `/math`

## 🔍 Nếu Vẫn Không Hoạt Động

### Kiểm tra 1: Guard có được load không?

Mở Console và chạy:

```javascript
// Kiểm tra xem có user data không
console.log('User:', localStorage.getItem('thuyChi_user'));
console.log('Token:', localStorage.getItem('thuyChi_token'));
```

Nếu có dữ liệu → Xóa và test lại

### Kiểm tra 2: Xem routing config

Mở file `app.routes.ts` và kiểm tra:

- Dòng 9: `canActivate: [StudentGuard]` có tồn tại không?
- Dòng 149: `canActivate: [AuthGuard]` có tồn tại không?

### Kiểm tra 3: Xem console có lỗi không?

Mở Console (F12) → Tab "Console"

- Có lỗi đỏ nào không?
- Có warning nào về routing không?

### Kiểm tra 4: Hard reload

```
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

Hoặc:

1. Mở DevTools (F12)
2. Click chuột phải vào nút Reload
3. Chọn "Empty Cache and Hard Reload"

## 📊 Debug Output Mẫu

### Khi CHƯA đăng nhập, truy cập `/math`

```
🔒 StudentGuard Check: {
  path: "math",
  isAuthenticated: false,
  isStudent: false,
  currentUser: null
}
❌ Access denied, redirecting to /home
```

### Khi ĐÃ đăng nhập (student), truy cập `/math`

```
🔒 StudentGuard Check: {
  path: "math",
  isAuthenticated: true,
  isStudent: true,
  currentUser: {
    id: "xxx",
    role: "student",
    fullName: "Bé Thùy Chi"
  }
}
✅ User authenticated as student, allowing access
```

### Khi ĐÃ đăng nhập (student), truy cập `/parents`

```
🔒 AuthGuard (Parent) Check: {
  isAuthenticated: true,
  isParent: false,
  currentUser: {
    id: "xxx",
    role: "student",
    fullName: "Bé Thùy Chi"
  }
}
❌ Parent access denied, redirecting to /home
```

## 🐛 Các Vấn Đề Thường Gặp

### Vấn đề 1: Không redirect

**Nguyên nhân:** Browser đã cache user data
**Giải pháp:** Xóa localStorage và reload

### Vấn đề 2: Redirect về `/login` thay vì `/home`

**Nguyên nhân:** Code cũ vẫn còn trong cache
**Giải pháp:** Hard reload (Ctrl + Shift + R)

### Vấn đề 3: Console không hiển thị log

**Nguyên nhân:** Guard không được trigger
**Giải pháp:** Kiểm tra `app.routes.ts` xem có `canActivate` không

### Vấn đề 4: Vào được route mà không cần login

**Nguyên nhân:** localStorage vẫn còn user data từ lần login trước
**Giải pháp:** Chạy `localStorage.clear()` trong console

## ✅ Checklist

- [ ] Đã xóa localStorage
- [ ] Đã hard reload browser
- [ ] Console hiển thị log từ guards
- [ ] Redirect về `/home` khi truy cập route được bảo vệ
- [ ] Vào được `/home` và `/login` không cần đăng nhập
- [ ] Sau khi login, vào được các route tương ứng với role
