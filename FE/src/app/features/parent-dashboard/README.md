# Màn Báo Cáo Học Tập - Learning Report Component

## Tổng quan

Component **Learning Report** cung cấp giao diện báo cáo chi tiết về tiến độ học tập của trẻ cho phụ huynh. Màn hình này được thiết kế với giao diện hiện đại, trực quan và đầy đủ thông tin.

## Tính năng chính

### 1. 📊 Tổng Quan Thống Kê

- **Thời gian học**: Tổng số phút học trong khoảng thời gian được chọn
- **Bài học hoàn thành**: Số lượng bài học đã hoàn thành
- **Điểm trung bình**: Điểm số trung bình của tất cả các bài học
- **Chuỗi ngày học**: Số ngày học liên tiếp

### 2. 📈 Biểu Đồ Hoạt Động Hàng Ngày

- Biểu đồ cột thể hiện thời gian học mỗi ngày trong tuần
- Highlight ngày hiện tại
- Hiển thị số phút học cụ thể cho mỗi ngày

### 3. 🎯 Thành Tích Theo Môn Học

Mỗi môn học hiển thị:

- Tổng thời gian học
- Số bài đã hoàn thành
- Điểm trung bình
- **Điểm mạnh**: Các chủ đề bé học tốt
- **Cần cải thiện**: Các chủ đề cần luyện tập thêm
- **Xu hướng**: Tiến bộ (tăng/giảm/ổn định)

### 4. 🏆 Thành Tích Gần Đây

Hiển thị các thành tích mới đạt được:

- **Streak**: Học liên tục nhiều ngày
- **Mastery**: Thành thạo một chủ đề
- **Speed**: Hoàn thành nhanh
- **Perfect**: Đạt điểm tuyệt đối

### 5. 💡 Nhận Xét & Đề Xuất

- **Điểm tích cực**: Những điều bé làm tốt
- **Gợi ý**: Khuyến nghị để cải thiện
- **Mục tiêu**: Mục tiêu cho tuần/tháng tới

## Cách sử dụng

### Truy cập

Màn hình báo cáo có thể truy cập qua:

- URL: `/parents/reports`
- Từ Parent Dashboard → Menu → Báo cáo

### Chọn khoảng thời gian

Sử dụng các nút ở đầu trang để chọn:

- **Tuần này**: Xem báo cáo 7 ngày gần nhất
- **Tháng này**: Xem báo cáo 30 ngày gần nhất
- **Năm nay**: Xem báo cáo từ đầu năm

### Chuyển đổi giữa các con

Nếu có nhiều con, sử dụng **Student Switcher** ở góc trên bên phải để chuyển đổi xem báo cáo của từng bé.

## Cấu trúc dữ liệu

### WeeklyStats

```typescript
interface WeeklyStats {
  totalMinutes: number;      // Tổng phút học
  totalLessons: number;      // Tổng bài học
  averageScore: number;      // Điểm TB (%)
  streak: number;            // Số ngày liên tiếp
  improvement: number;       // % cải thiện
}
```

### SubjectReport

```typescript
interface SubjectReport {
  subject: string;           // Tên môn học
  icon: string;              // Icon emoji
  color: string;             // Màu gradient
  totalTime: number;         // Tổng thời gian (phút)
  lessonsCompleted: number;  // Số bài hoàn thành
  averageScore: number;      // Điểm TB (%)
  strongAreas: string[];     // Điểm mạnh
  improvementAreas: string[]; // Cần cải thiện
  trend: 'up' | 'down' | 'stable'; // Xu hướng
}
```

### DailyActivity

```typescript
interface DailyActivity {
  date: Date;                // Ngày
  totalMinutes: number;      // Phút học
  lessonsCompleted: number;  // Bài hoàn thành
  averageScore: number;      // Điểm TB
}
```

### Achievement

```typescript
interface Achievement {
  title: string;             // Tiêu đề
  description: string;       // Mô tả
  icon: string;              // Icon emoji
  earnedDate: Date;          // Ngày đạt được
  category: 'streak' | 'mastery' | 'speed' | 'perfect';
}
```

## Tích hợp API

### Hiện tại

Component đang sử dụng **mock data** để demo.

### Tích hợp thực tế

Để tích hợp với backend API, cập nhật method `loadReportData()`:

```typescript
async loadReportData(): Promise<void> {
  const studentId = this.selectedStudent()?.id;
  const timeRange = this.selectedTimeRange();
  
  if (!studentId) return;
  
  try {
    // Gọi API để lấy dữ liệu
    const response = await this.reportService.getReport(studentId, timeRange);
    
    // Cập nhật signals
    this.weeklyStats.set(response.weeklyStats);
    this.dailyActivities.set(response.dailyActivities);
    this.subjectReports.set(response.subjectReports);
    this.recentAchievements.set(response.recentAchievements);
  } catch (error) {
    console.error('Error loading report:', error);
  }
}
```

## Thiết kế UI

### Màu sắc chủ đạo

- **Background**: Gradient tím (#667eea → #764ba2)
- **Cards**: Trắng với shadow
- **Accents**:
  - Pink: #f093fb → #f5576c
  - Blue: #4facfe → #00f2fe
  - Green: #43e97b → #38f9d7
  - Orange: #fa709a → #fee140

### Responsive

- **Desktop**: Grid layout đầy đủ
- **Tablet**: Grid 2 cột
- **Mobile**: Single column, compact view

### Animations

- Hover effects trên cards
- Smooth transitions
- Bar chart animations

## Các component liên quan

- `parent-dashboard.component.ts`: Dashboard tổng quan
- `student-switcher.component.ts`: Chuyển đổi học sinh

## Dependencies

```typescript
import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentSwitcherComponent } from '../../shared/components/student-switcher.component';
import { StudentSwitcherService } from '../../core/services/student-switcher.service';
```

## Roadmap

### Phase 1 (Hiện tại)

- ✅ UI design hoàn chỉnh
- ✅ Mock data
- ✅ Responsive layout

### Phase 2 (Sắp tới)

- [ ] Tích hợp API backend
- [ ] Export báo cáo PDF
- [ ] So sánh tiến độ giữa các kỳ
- [ ] Thông báo khi có thành tích mới

### Phase 3 (Tương lai)

- [ ] AI insights & recommendations
- [ ] Biểu đồ nâng cao (line chart, pie chart)
- [ ] Chia sẻ báo cáo với giáo viên
- [ ] Đặt mục tiêu tùy chỉnh

## Hỗ trợ

Nếu có vấn đề hoặc câu hỏi, vui lòng liên hệ team phát triển.
