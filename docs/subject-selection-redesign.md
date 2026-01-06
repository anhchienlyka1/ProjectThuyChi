# Dự án Thủy Chi - Bé Vui Học (5-7 Tuổi)

---

## 1. Kiến trúc Hệ thống Cốt lõi (Advanced Core Architecture) 🏗️

### 1.1. Hạ tầng Ứng dụng

- Cấu trúc folder theo hướng Feature-Sliced (Core, Shared, Features)
- Routing & Route Guards (Bảo vệ trang Phụ huynh bằng phép toán khó)
- Cơ chế `ThemeService`: Quản lý giao diện Sáng/Tối hoặc theo chủ đề Mùa

### 1.2. Hệ thống Quản lý Người dùng & Phụ huynh (Parental Control)

- `SessionTimerService`: Đếm giờ học, tự động khóa khi hết giờ (15p/session)
- `ParentSettingsStore`: Lưu cấu hình giới hạn thời gian, âm lượng, nhắc nhở
- `ReportService`: Ghi log tiến độ chi tiết (Môn nào yếu, bài nào hay sai)

### 1.3. Động cơ Game hóa (Gamification Engine)

- `GamificationStore`: Quản lý logic Sao, Kim Cương, Chuỗi ngày (Streak)
- `AchievementSystem` (Service): Hệ thống Huy hiệu & Mở khóa Sticker/Nhân vật
- `ShopSystem` (Service): Cơ chế đổi Sao lấy vật phẩm ảo (Mũ, Kính cho Avatar)

### 1.4. Hệ thống Phản hồi & Linh vật (Mascot Feedback System)

- `MascotService`: Điều phối trạng thái cảm xúc của nhân vật (Vui, Buồn, Ngạc nhiên)
- `AudioEngine`: Quản lý layer âm thanh (Nhạc nền, SFX, Voice hướng dẫn)

---

## 2. Giao diện Chính (Home Experience)

### 2.1. Trang Chủ (Home)

- **Hero Section**: Linh vật tương tác (Live2D/CSS Animation) chào hỏi
- **Dashboard mini**: Hiển thị Streak & Huy hiệu mới nhất
- **Subject Menu**: 3 Nút tròn lớn (Toán, Việt, Anh) với hiệu ứng parallax và giao diện 3D

---

## 3. Modules Học tập Chi tiết (Curriculum & Game Mechanics) 🧠

### 3.1. Phân hệ Toán học - Vương Quốc Số (Math Kingdom) 🧮

#### Cơ chế Game (Game Engines)

- **CountingGameEngine**: Kéo vật phẩm vào giỏ (Drag & Drop)
- **ComparisonEngine**: Cân đĩa thăng bằng (Nặng/Nhẹ, Nhiều/Ít)
- **LogicEngine**: Điền số còn thiếu vào đoàn tàu

#### Nội dung Bài học (Curriculum)

- **Level 1**: Nhận biết số 0-10 (Hình ảnh trực quan)
- **Level 2**: So sánh Lớn/Bé/Bằng (> < =)
- **Level 3**: Phép cộng trong phạm vi 10 (Hình ảnh: 2 Táo + 3 Táo)
- **Level 4**: Hình học cơ bản (Vuông, Tròn, Tam giác) - Game phân loại hình

---

### 3.2. Phân hệ Tiếng Việt - Làng Chữ Cái (Vietnamese Village) 📘

#### Cơ chế Game (Game Engines)

- **TracingEngine**: Tập tô chữ cái trên màn hình (Canvas drawing)
- **PhonicsEngine**: Bấm vào loa chọn từ đúng (Nghe → Hình)
- **SpellingEngine**: Ghép toa tàu thành từ có nghĩa (C - Á → CÁ)

#### Nội dung Bài học (Curriculum)

- **Chữ cái**: 29 chữ cái (Viết hoa/thường)
- **Dấu thanh**: Sắc, Huyền, Hỏi, Ngã, Nặng (Ví dụ trực quan: "Ma - Má - Mả")
- **Ghép vần đơn**: B-A-BA, C-A-CA

---

### 3.3. Phân hệ Tiếng Anh - Công Viên Ngoại Ngữ (English Park) 🇬🇧

#### Cơ chế Game (Game Engines)

- **FlashcardEngine**: Lật thẻ hình/từ vựng (Memory Game)
- **ListeningEngine**: "Simon says" - Nghe lệnh và chọn hành động

#### Topic Từ vựng

- **Colors** (Màu sắc) & **Shapes** (Hình khối)
- **Numbers** (Đếm số tiếng Anh)
- **Family** (Gia đình) & **Animals** (Động vật)

---

## 4. Quản trị & Báo cáo (Parent Dashboard)

### 4.1. Dashboard Phụ Huynh

- **Dashboard tổng quan**: Biểu đồ Radar kỹ năng
- **Lịch sử học tập chi tiết** & Gợi ý bài học tiếp theo

---

## 5. Cấu trúc Components đã tạo

### 5.1. Module Selection Components

1. `src/app/features/math-modules/math-modules.component.ts`
2. `src/app/features/vietnamese-modules/vietnamese-modules.component.ts`
3. `src/app/features/english-modules/english-modules.component.ts`
4. `src/app/features/games-modules/games-modules.component.ts`

### 5.2. Routing Structure

```
/home
  └─ /select-subject
      ├─ /math (Math Modules)
      │   ├─ /math/counting
      │   ├─ /math/operations
      │   ├─ /math/shapes
      │   └─ /math/measurement
      │
      ├─ /vietnamese (Vietnamese Modules)
      │   ├─ /vietnamese/alphabet
      │   ├─ /vietnamese/reading
      │   ├─ /vietnamese/writing
      │   └─ /vietnamese/vocabulary
      │
      ├─ /english (English Modules)
      │   ├─ /english/alphabet
      │   ├─ /english/words
      │   ├─ /english/sentences
      │   └─ /english/phonics
      │
      └─ /games (Games Modules)
          ├─ /games/memory
          ├─ /games/puzzle
          ├─ /games/logic
          └─ /games/creative
```

---

## 6. Next Steps

- [ ] Update `app.routes.ts` với routing structure mới
- [ ] Tạo placeholder lesson components
- [ ] Implement game engines (CountingGameEngine, TracingEngine, etc.)
- [ ] Tích hợp audio system
- [ ] Xây dựng parent dashboard
- [ ] Testing & optimization
