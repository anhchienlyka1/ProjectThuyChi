# Hướng Dẫn Quản Lý Dữ Liệu - Tập Đánh Vần & Ghép Từ Đơn

## Tổng Quan

Các màn **Tập Đánh Vần** và **Ghép Từ Đơn** đã được tích hợp với database MySQL thông qua REST API. Bạn có thể dễ dàng thêm, sửa, xóa các bài học mà không cần chỉnh sửa code.

## Cấu Trúc Database

### Bảng `questions`

Lưu trữ tất cả các câu hỏi/bài học cho cả hai màn:

| Cột | Mô tả |
|-----|-------|
| `id` | ID tự động tăng |
| `level_id` | `'spelling'` hoặc `'simple-words'` |
| `question_type` | Loại câu hỏi |
| `content` | JSON chứa nội dung bài học |
| `order_index` | Thứ tự hiển thị |
| `points` | Điểm số (mặc định 10) |

### Cấu Trúc JSON

#### Tập Đánh Vần (spelling)

```json
{
  "word": "CÁ",
  "image": "🐟",
  "parts": [
    { "text": "C", "missing": false },
    { "text": "Á", "missing": true }
  ],
  "options": ["A", "Á", "À"],
  "hint": "Dấu sắc trên chữ a!"
}
```

#### Ghép Từ Đơn (simple-words)

```json
{
  "word": "CÁ",
  "image": "🐟",
  "hint": "Con gì bơi dưới nước?"
}
```

## API Endpoints

### 1. Lấy Danh Sách Bài Học

**Tập Đánh Vần:**

```
GET http://localhost:3000/questions?levelId=spelling
```

**Ghép Từ Đơn:**

```
GET http://localhost:3000/questions?levelId=simple-words
```

**Response:** Array of questions

### 2. Thêm Bài Học Mới

```
POST http://localhost:3000/questions
Content-Type: application/json

{
  "levelId": "spelling",
  "type": "spelling",
  "content": {
    "word": "MÁY",
    "image": "💻",
    "parts": [
      { "text": "M", "missing": false },
      { "text": "ÁY", "missing": true }
    ],
    "options": ["AY", "ÁY", "ẢY"],
    "hint": "Dụng cụ điện tử"
  }
}
```

### 3. Cập Nhật Bài Học

```
PUT http://localhost:3000/questions/{id}
Content-Type: application/json

{
  "content": {
    "word": "MÁY",
    "image": "🖥️",
    "parts": [
      { "text": "M", "missing": false },
      { "text": "ÁY", "missing": true }
    ],
    "options": ["AY", "ÁY", "ẢY"],
    "hint": "Máy tính"
  }
}
```

### 4. Xóa Bài Học

```
DELETE http://localhost:3000/questions/{id}
```

## Cách Sử Dụng

### Thêm Bài Học Mới Qua Postman/Thunder Client

1. Mở Postman hoặc Thunder Client
2. Tạo request mới với method `POST`
3. URL: `http://localhost:3000/questions`
4. Headers: `Content-Type: application/json`
5. Body: Paste JSON content như ví dụ trên
6. Click Send

### Cập Nhật File Seed

Nếu muốn thêm nhiều bài cùng lúc:

1. Mở file tương ứng:
   - `BE/src/infrastructure/database/seeds/data/spelling-config.json`
   - `BE/src/infrastructure/database/seeds/data/simple-words-config.json`

2. Thêm object mới vào array:

```json
{
  "word": "MÁY",
  "image": "💻",
  "parts": [
    { "text": "M", "missing": false },
    { "text": "ÁY", "missing": true }
  ],
  "options": ["AY", "ÁY", "ẢY"],
  "hint": "Dụng cụ điện tử"
}
```

1. Chạy lại seed script:

```bash
cd BE
npm run seed
```

## Lưu Ý Quan Trọng

### Tập Đánh Vần

- `parts`: Mảng các phần của từ, mỗi phần có `text` và `missing`
- Chỉ nên có **1 phần** có `missing: true`
- `options`: Mảng các lựa chọn, phải chứa đáp án đúng (text của phần missing)
- Đáp án đúng phải **khớp chính xác** với `text` của phần `missing: true`

### Ghép Từ Đơn

- `word`: Từ cần ghép (chữ in hoa)
- `image`: Emoji đại diện
- `hint`: Gợi ý cho trẻ
- Hệ thống tự động tách từ thành các chữ cái và xáo trộn

### Emoji Icons

Sử dụng emoji để làm hình ảnh:

- 🐟 🐔 🚗 🌸 ⚽ 🐱 🐕 🏠 👕 🍎
- 🍃 📚 ✏️ 🪑 💻 📱 🎒 🌈 ⭐ 🌙

## Kiểm Tra Dữ Liệu

### Qua MySQL Workbench

```sql
-- Xem tất cả bài Tập Đánh Vần
SELECT * FROM questions WHERE level_id = 'spelling' AND is_deleted = false;

-- Xem tất cả bài Ghép Từ Đơn
SELECT * FROM questions WHERE level_id = 'simple-words' AND is_deleted = false;

-- Đếm số lượng bài
SELECT level_id, COUNT(*) as total 
FROM questions 
WHERE is_deleted = false 
GROUP BY level_id;
```

### Qua API (Browser hoặc Postman)

```
http://localhost:3000/questions?levelId=spelling
http://localhost:3000/questions?levelId=simple-words
```

## Troubleshooting

### Lỗi: "No spelling levels found in database"

- Kiểm tra backend có đang chạy không: `npm run start:dev`
- Kiểm tra database có data không: Chạy query SQL ở trên
- Chạy lại seed: `npm run seed`

### Bài học không hiển thị

- Kiểm tra `is_deleted = false` trong database
- Kiểm tra `order_index` có đúng không
- Xem console log trong browser (F12)

### Lỗi khi thêm bài mới

- Kiểm tra JSON format có đúng không
- Đảm bảo tất cả field bắt buộc đều có
- Kiểm tra backend logs

## Ví Dụ Thực Tế

### Thêm 5 bài Tập Đánh Vần mới về động vật

1. Tạo file `new-animals.json`:

```json
[
  {
    "word": "VỊT",
    "image": "🦆",
    "parts": [{"text": "V", "missing": false}, {"text": "ỊT", "missing": true}],
    "options": ["IT", "ỊT", "ÍT"],
    "hint": "Con gì kêu quạc quạc?"
  },
  {
    "word": "BÒ",
    "image": "🐄",
    "parts": [{"text": "B", "missing": false}, {"text": "Ò", "missing": true}],
    "options": ["O", "Ò", "Ó"],
    "hint": "Con gì cho sữa?"
  }
]
```

1. Dùng script hoặc Postman để POST từng item

2. Hoặc thêm vào `spelling-config.json` và chạy `npm run seed`

## Kết Luận

Với hệ thống API này, bạn có thể:

- ✅ Thêm bài học mới không cần code
- ✅ Cập nhật nội dung dễ dàng
- ✅ Xóa bài học (soft delete)
- ✅ Quản lý thứ tự hiển thị
- ✅ Backup/restore qua JSON files
