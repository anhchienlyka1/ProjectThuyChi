# 🔄 Simplified Architecture Update

## 🎯 Mục tiêu
Đơn giản hóa kiến trúc bằng cách loại bỏ **Domain Services**. Toàn bộ Business Logic sẽ được tập trung tại **Application Layer** (Use Cases).

## 📋 Những thay đổi đã thực hiện

1. **Xóa Domain Services**:
   - Đã xóa thư mục `src/domain/services/`
   - Đã xóa các file service (`email-validation`, `password-validation`)

2. **Cập nhật Use Case**:
   - `CreateUserUseCase` hiện chứa toàn bộ logic validation và xử lý nghiệp vụ.
   - Logic kiểm tra email, validate format, kiểm tra disposable domain được chuyển vào trong Use Case.

3. **Cập nhật Module**:
   - `UserModule` không còn provide các domain services.

## 🏗️ Cấu trúc mới

```
src/
├── domain/                    🟡 Entities & Interfaces ONLY
│   ├── entities/             (Chỉ chứa cấu trúc dữ liệu)
│   └── repositories/         (Chỉ chứa interface)
│
├── application/              🔵 Business Logic CENTER
│   ├── use-cases/            (Chứa TOÀN BỘ logic nghiệp vụ)
│   └── dtos/                 (Validation input/output)
│
├── infrastructure/           🟢 Technical Details
└── presentation/             🟣 API Endpoints
```

## 💡 Tại sao lại thay đổi này?

- **Đơn giản hóa**: Giảm bớt số lượng file và layer không cần thiết cho dự án vừa và nhỏ.
- **Tập trung Logic**: Dễ dàng tìm thấy logic nghiệp vụ vì tất cả nằm trong Use Case.
- **Dễ hiểu hơn**: Tránh nhầm lẫn giữa Domain Service và Application Service.
- **Phù hợp thực tế**: Với nhiều dự án, Use Case là đủ để xử lý tất cả logic.

## 📝 Quy tắc mới

1. **Use Case** là nơi duy nhất chứa Business Logic.
2. **Domain Layer** chỉ dùng để định nghĩa Type, Interface và Entity (anemic or simple rich model).
3. Không tạo `domain/services`.

---
*Updated: 2026-01-08*
