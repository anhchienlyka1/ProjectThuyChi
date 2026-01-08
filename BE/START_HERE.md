# 📖 Clean Architecture - Navigation Guide

Chào mừng bạn đến với Backend project sử dụng Clean Architecture!

## 🚀 Bắt đầu nhanh

### Bước 1: Đọc tài liệu
👉 **[SETUP_SUMMARY.md](./SETUP_SUMMARY.md)** - Đọc file này trước!

### Bước 2: Hiểu kiến trúc
👉 **[README.md](./README.md)** - Quick Start Guide

### Bước 3: Xem diagrams
- Xem hình ảnh Clean Architecture Diagram trong artifacts
- Xem hình ảnh Data Flow Diagram trong artifacts

## 📚 Tài liệu chi tiết

### Kiến trúc
- **[CLEAN_ARCHITECTURE.md](./CLEAN_ARCHITECTURE.md)** - Giải thích chi tiết về Clean Architecture
- **[ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)** - Sơ đồ text-based và visualization

### Hướng dẫn kỹ thuật
- **[DATABASE_INTEGRATION.md](./DATABASE_INTEGRATION.md)** - Cách tích hợp database (TypeORM, PostgreSQL)
- **[.env.example](./.env.example)** - Template cho environment variables

### Theo dõi tiến độ
- **[CHECKLIST.md](./CHECKLIST.md)** - Checklist các tasks đã làm và cần làm

## 🗂️ Cấu trúc Project

```
BE/
├── src/
│   ├── domain/              # ⭐ Core Business Logic
│   ├── application/         # 🎯 Use Cases & DTOs
│   ├── infrastructure/      # 🔧 Database & External Services
│   ├── presentation/        # 🌐 Controllers & API
│   ├── shared/              # 🔄 Common Code
│   └── modules/             # 📦 NestJS Modules
│
├── SETUP_SUMMARY.md         # 📋 Tóm tắt setup
├── README.md                # 📖 Quick Start
├── CLEAN_ARCHITECTURE.md    # 📚 Chi tiết kiến trúc
├── ARCHITECTURE_DIAGRAM.md  # 📊 Sơ đồ
├── DATABASE_INTEGRATION.md  # 🗄️ Hướng dẫn database
├── CHECKLIST.md             # ✅ Checklist
└── .env.example             # ⚙️ Environment template
```

## 🎯 Đọc theo thứ tự

Nếu bạn mới bắt đầu, đọc theo thứ tự này:

1. ✅ **SETUP_SUMMARY.md** - Tổng quan những gì đã được setup
2. ✅ **README.md** - Cách chạy và sử dụng
3. ✅ **CLEAN_ARCHITECTURE.md** - Hiểu về kiến trúc
4. ✅ **ARCHITECTURE_DIAGRAM.md** - Xem sơ đồ chi tiết
5. ⏭️ **DATABASE_INTEGRATION.md** - Khi cần tích hợp database
6. ⏭️ **CHECKLIST.md** - Khi muốn mở rộng features

## 🔍 Tìm kiếm nhanh

### Tôi muốn...

**...chạy project**
→ Xem [README.md - Quick Start](./README.md#-quick-start)

**...hiểu Clean Architecture**
→ Xem [CLEAN_ARCHITECTURE.md](./CLEAN_ARCHITECTURE.md)

**...thêm feature mới**
→ Xem [README.md - Workflow](./README.md#-workflow-thêm-feature-mới)

**...tích hợp database**
→ Xem [DATABASE_INTEGRATION.md](./DATABASE_INTEGRATION.md)

**...xem cấu trúc code**
→ Xem [ARCHITECTURE_DIAGRAM.md - File Structure](./ARCHITECTURE_DIAGRAM.md#-file-structure-với-ví-dụ-user-module)

**...biết đã làm gì và cần làm gì**
→ Xem [CHECKLIST.md](./CHECKLIST.md)

## 🎓 Học Clean Architecture

### Beginner
1. Đọc SETUP_SUMMARY.md
2. Chạy project và test API
3. Xem code trong `src/modules/user.module.ts`
4. Trace code flow từ Controller → Use Case → Repository

### Intermediate
1. Đọc CLEAN_ARCHITECTURE.md
2. Hiểu Dependency Rule
3. Thử thêm một feature mới (Product, Order, etc.)
4. Viết unit tests

### Advanced
1. Tích hợp database thật
2. Thêm Authentication & Authorization
3. Implement caching với Redis
4. Setup CI/CD pipeline

## 📞 Quick Reference

### Commands
```bash
# Development
npm run start:dev

# Production build
npm run build
npm run start:prod

# Testing
npm run test
npm run test:e2e
```

### API Endpoints
- `POST /users` - Create user
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user

### File Locations
- **Entities**: `src/domain/entities/`
- **Use Cases**: `src/application/use-cases/`
- **DTOs**: `src/application/dtos/`
- **Controllers**: `src/presentation/controllers/`
- **Repositories**: `src/infrastructure/repositories/`

## 🎨 Visual Diagrams

Xem 2 hình ảnh đã được tạo trong artifacts:
1. **Clean Architecture Diagram** - Concentric circles showing layers
2. **Data Flow Diagram** - Request/Response flow

## 💡 Tips

- 💾 **Save this file** - Bookmark để dễ tìm tài liệu
- 📖 **Read sequentially** - Đọc theo thứ tự để hiểu rõ
- 🧪 **Practice** - Thử thêm features mới để học
- 🤝 **Ask questions** - Đừng ngại hỏi khi không hiểu

## 🎯 Next Steps

1. ✅ Đọc SETUP_SUMMARY.md
2. ✅ Chạy project
3. ✅ Test API endpoints
4. ⏭️ Đọc CLEAN_ARCHITECTURE.md
5. ⏭️ Thử thêm feature mới
6. ⏭️ Tích hợp database

---

**Happy Coding! 🚀**

*Last Updated: 2026-01-08*
