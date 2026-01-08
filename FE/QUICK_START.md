# Quick Start Guide - Frontend

## Chạy ứng dụng

### Development Mode
```bash
npm run dev
```
Ứng dụng sẽ chạy tại: `http://localhost:4200/`

### Production Build
```bash
npm run build
```

### Run Tests
```bash
npm test
```

## Cấu trúc thư mục

```
FE/
├── src/
│   ├── app/
│   │   ├── core/           # Services, guards, interceptors
│   │   ├── features/       # Feature modules (math-modules, etc.)
│   │   ├── shared/         # Shared components, directives, pipes
│   │   └── layouts/        # Layout components
│   ├── styles.css          # Global styles
│   └── main.ts             # Application entry point
├── public/
│   └── assets/             # Static assets (images, audio, mock-data)
├── angular.json            # Angular configuration
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Các module chính

- **Math Modules**: Các bài học toán (Đếm, So sánh, Cộng, Trừ, v.v.)
- **Age Selection**: Chọn độ tuổi
- **Subject Selection**: Chọn môn học
- **Mascot**: Trợ lý học tập ảo

## Lưu ý

- Node.js phiên bản 18 trở lên
- Đã cài đặt npm
- Port 4200 phải available
