# Dự Án Thùy Chi - Frontend Only

## Tổng Quan

Dự án này đã được **đơn giản hóa** để chỉ chạy trên **frontend** với **mock data**. Tất cả backend đã được loại bỏ và các services hiện sử dụng mock data thay vì gọi API thực.

## Thay Đổi Chính

### 1. **Loại Bỏ Backend**
- Thư mục `BE` đã được xóa hoàn toàn
- Không cần database (PostgreSQL)
- Không cần chạy backend server

### 2. **Mock Data**
Tất cả dữ liệu hiện được lưu trong thư mục `FE/src/app/core/mock-data/`:

- **users.mock.ts** - Dữ liệu người dùng (students)
  - Bé Minh (PIN: `123456`)
  - Bé Hoa (PIN: `111111`)
  - Bé Nam (PIN: `222222`)

- **levels.mock.ts** - Các cấp độ học tập (Math & Vietnamese)
  - Math: Đếm Số, Cộng, Trừ, So Sánh, Hình Học
  - Vietnamese: Bảng Chữ Cái, Từ Đơn, Điền Chữ, Ghép Vần

- **achievements.mock.ts** - Thành tích & phiếu bé ngoan
  - Bài học đầu tiên
  - Cao thủ toán học
  - Điểm tuyệt đối
  - Tốc độ ánh sáng
  - Phiếu bé ngoan

- **learning-sessions.mock.ts** - Lịch sử học tập & tiến độ
  - Lưu kết quả học tập trong memory (sẽ mất khi reload)
  - Tính toán sao dựa trên accuracy
  - Phát hiện cải thiện để trao phiếu bé ngoan

### 3. **Services Đã Cập Nhật**

Tất cả các service sau đã được chuyển đổi để sử dụng mock data:

- ✅ **auth.service.ts** - Đăng nhập, đăng xuất sử dụng mock users
- ✅ **student-profile.service.ts** - Profile overview, achievements, weekly achievements
- ✅ **math-level.service.ts** - Danh sách levels môn Toán
- ✅ **vietnamese-level.service.ts** - Danh sách levels môn Tiếng Việt
- ✅ **learning.service.ts** - Lưu kết quả học tập, thống kê thời gian

## Cách Chạy Dự Án

### Yêu Cầu
- Node.js (v16 hoặc cao hơn)
- npm

### Cài Đặt và Chạy

1. **Di chuyển vào thư mục FE**
   ```bash
   cd FE
   ```

2. **Cài đặt dependencies** (nếu chưa cài)
   ```bash
   npm install
   ```

3. **Chạy ứng dụng**
   ```bash
   npm start
   # hoặc
   ng serve
   ```

4. **Mở trình duyệt**
   ```
   http://localhost:4200
   ```

## Đăng Nhập

Bạn có thể đăng nhập bằng một trong các tài khoản sau:

| Tên đăng nhập | Mã PIN | Cấp độ | Số sao |
|--------------|--------|--------|--------|
| bé minh      | 123456 | 5      | 150    |
| bé hoa       | 111111 | 3      | 85     |
| bé nam       | 222222 | 7      | 280    |

## Lưu Ý Quan Trọng

### Dữ Liệu Tạm Thời
- Tất cả dữ liệu học tập mới (kết quả bài tập, tiến độ) được lưu trong **memory**
- Khi **reload** trang, dữ liệu sẽ về trạng thái ban đầu
- Nếu muốn dữ liệu persist, cần implement localStorage hoặc kết nối backend thực

### Thêm/Sửa Mock Data
Để thêm hoặc sửa dữ liệu mock:

1. **Thêm user mới** - Sửa file `mock-data/users.mock.ts`
2. **Thêm level mới** - Sửa file `mock-data/levels.mock.ts`
3. **Thêm achievement** - Sửa file `mock-data/achievements.mock.ts`

### Tính Năng Đang Hoạt Động
✅ Đăng nhập/đăng xuất  
✅ Xem profile học sinh  
✅ Xem danh sách levels (Math & Vietnamese)  
✅ Hoàn thành bài học và nhận sao  
✅ Nhận phiếu bé ngoan khi cải thiện  
✅ Xem thành tích  
✅ Xem thống kê tiến độ  

### Tính Năng Cần Cải Thiện (Nếu Muốn)
- 🔄 Lưu dữ liệu vào localStorage để persist
- 🔄 Tạo mock data cho các game modules (addition, subtraction, comparison, etc.)
- 🔄 Implement dashboard với charts

## Cấu Trúc Thư Mục

```
FE/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── mock-data/          # ⭐ Mock data files
│   │   │   │   ├── users.mock.ts
│   │   │   │   ├── levels.mock.ts
│   │   │   │   ├── achievements.mock.ts
│   │   │   │   └── learning-sessions.mock.ts
│   │   │   ├── services/           # Services sử dụng mock data
│   │   │   └── models/             # TypeScript interfaces
│   │   ├── features/               # Feature modules
│   │   └── shared/                 # Shared components
│   ├── environments/               # Environment config
│   └── assets/                     # Static assets
├── package.json
└── angular.json
```

## Khôi Phục Backend (Tùy Chọn)

Nếu bạn muốn khôi phục backend:

1. Restore thư mục BE từ git history:
   ```bash
   git checkout HEAD -- BE/
   ```

2. Revert các thay đổi trong services:
   ```bash
   git checkout HEAD -- FE/src/app/core/services/
   ```

3. Xóa thư mục mock-data:
   ```bash
   rm -rf FE/src/app/core/mock-data
   ```

## Hỗ Trợ

Nếu có vấn đề:
1. Kiểm tra console trong browser (F12)
2. Kiểm tra terminal có lỗi không
3. Xác nhận đang ở đúng thư mục FE khi chạy `ng serve`

---

**Phiên bản**: Frontend-Only v1.0  
**Ngày cập nhật**: 27/01/2026
