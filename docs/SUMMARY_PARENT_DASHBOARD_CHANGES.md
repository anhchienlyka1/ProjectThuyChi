# Tóm Tắt Thay Đổi - Parent Dashboard

## 📋 Tổng Quan

Đã hoàn thành 2 yêu cầu:

1. ✅ Thiết kế API cho màn "Bộ Sưu Tập Phiếu Bé Ngoan"
2. ✅ Thụt phần container xuống để không bị sát header

---

## 🔧 Thay Đổi Backend

### 1. Dashboard Service (`BE/src/application/services/dashboard.service.ts`)

**Thêm method mới: `getCertificates()`**

```typescript
async getCertificates(userId: string, options?: { 
  limit?: number; 
  offset?: number; 
  status?: 'locked' | 'unlocked' 
})
```

**Chức năng:**

- Lấy danh sách phiếu bé ngoan của học sinh
- Hỗ trợ pagination (limit, offset)
- Tính toán số tuần trong năm
- Transform dữ liệu sang format certificate

**Response:**

```typescript
{
  certificates: Certificate[],
  total: number,
  hasMore: boolean
}
```

### 2. Dashboard Controller (`BE/src/presentation/controllers/dashboard.controller.ts`)

**Thêm endpoint mới:**

```
GET /api/dashboard/certificates?userId={userId}&limit={limit}&offset={offset}
```

**Query Parameters:**

- `userId` (required): ID của học sinh
- `limit` (optional): Số lượng phiếu tối đa
- `offset` (optional): Vị trí bắt đầu (pagination)

---

## 🎨 Thay Đổi Frontend

### 1. Dashboard Service (`FE/src/app/core/services/dashboard.service.ts`)

**Thêm method và interfaces:**

```typescript
// Method
async getCertificates(userId: string, options?: { 
  limit?: number; 
  offset?: number 
}): Promise<CertificatesResponse>

// Interfaces
interface Certificate {
  id: number;
  achievementId: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: Date;
  weekNumber: number;
  isUnlocked: boolean;
  earnedContext?: any;
}

interface CertificatesResponse {
  certificates: Certificate[];
  total: number;
  hasMore: boolean;
}
```

### 2. Parent Dashboard Component (`FE/src/app/features/parent-dashboard/parent-dashboard.component.html`)

**Thay đổi CSS:**

```html
<!-- Trước -->
<div class="max-w-7xl mx-auto space-y-6">

<!-- Sau -->
<div class="max-w-7xl mx-auto space-y-6 pt-6">
```

**Hiệu quả:**

- Thêm `pt-6` (padding-top: 1.5rem) để tạo khoảng cách với header
- Container không còn bị sát header nữa

---

## 📚 Tài Liệu

### 1. API Documentation (`docs/API_CERTIFICATES.md`)

Tài liệu chi tiết về API mới bao gồm:

- Mô tả endpoint
- Request/Response format
- Ví dụ sử dụng
- Error handling
- Frontend integration guide

### 2. Example Component (`docs/EXAMPLE_CERTIFICATE_COLLECTION_COMPONENT.ts`)

Component mẫu cho màn "Bộ Sưu Tập Phiếu Bé Ngoan" với:

- Grid layout responsive (1-4 cột tùy màn hình)
- Loading state
- Empty state
- Pagination (load more)
- Rarity-based styling (common, rare, epic, legendary)
- Date formatting
- Beautiful card design với hover effects

---

## 🎯 Cách Sử Dụng API

### Ví dụ 1: Lấy tất cả phiếu

```typescript
const response = await this.dashboardService.getCertificates(studentId);
console.log(response.certificates); // Danh sách phiếu
console.log(response.total);        // Tổng số phiếu
```

### Ví dụ 2: Lấy 20 phiếu đầu tiên

```typescript
const response = await this.dashboardService.getCertificates(studentId, {
  limit: 20,
  offset: 0
});
```

### Ví dụ 3: Load more (pagination)

```typescript
const currentCount = this.certificates().length;
const response = await this.dashboardService.getCertificates(studentId, {
  limit: 20,
  offset: currentCount
});

// Thêm vào danh sách hiện tại
this.certificates.update(certs => [...certs, ...response.certificates]);
```

---

## 🎨 Certificate Rarity Styling

API trả về 4 loại độ hiếm:

| Rarity | Label | Border Color | Background | Badge Color |
|--------|-------|--------------|------------|-------------|
| common | Thường | Gray | White | Gray |
| rare | Hiếm | Blue | Blue gradient | Blue |
| epic | Sử Thi | Purple | Purple gradient | Purple |
| legendary | Huyền Thoại | Yellow | Yellow gradient | Yellow |

---

## 📊 Database Schema

API sử dụng các bảng:

- `user_achievements`: Lưu phiếu đã đạt được
- `achievements`: Template của phiếu (title, description, icon, rarity)

---

## ✅ Checklist Hoàn Thành

- [x] Tạo method `getCertificates()` trong `DashboardService` (Backend)
- [x] Tạo endpoint `GET /dashboard/certificates` trong `DashboardController`
- [x] Tạo method `getCertificates()` trong `DashboardService` (Frontend)
- [x] Thêm interfaces `Certificate` và `CertificatesResponse`
- [x] Thụt container xuống bằng cách thêm `pt-6`
- [x] Tạo tài liệu API chi tiết
- [x] Tạo component mẫu cho certificate collection

---

## 🚀 Bước Tiếp Theo (Tùy Chọn)

1. **Tạo route mới** cho màn certificate collection:

   ```typescript
   // app.routes.ts
   {
     path: 'parents/certificates',
     component: CertificateCollectionComponent
   }
   ```

2. **Thêm link vào sidebar** của parent layout:

   ```html
   <a routerLink="/parents/certificates">
     <span>🏆</span>
     <span>Phiếu Bé Ngoan</span>
   </a>
   ```

3. **Tạo certificate detail modal** để xem chi tiết từng phiếu

4. **Thêm filter** theo rarity hoặc theo tháng/tuần

5. **Thêm animation** khi hover vào certificate card

---

## 📝 Notes

- Backend đang chạy tại: `http://localhost:3000`
- Frontend đang chạy tại: `http://localhost:4200`
- API endpoint: `http://localhost:3000/api/dashboard/certificates`
- Số tuần được tính theo ISO week number (từ đầu năm)
- Certificates được sắp xếp theo ngày đạt được mới nhất trước

---

## 🐛 Lưu Ý Về Lint Errors

Có một số lint errors trong `student-profile-card.component.ts` (duplicate identifier và object possibly undefined). Những lỗi này không liên quan đến thay đổi hiện tại và có thể được xử lý riêng sau.
