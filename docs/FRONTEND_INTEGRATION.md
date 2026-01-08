# Frontend Integration & Data Strategy

Tài liệu này mô tả chi tiết cách Frontend (Angular) xử lý dữ liệu động từ Database và định dạng JSON Payload cho từng loại game.

## 1. Strategy Xử Lý Tại Frontend (Angular)

Do mỗi `question_type` có cấu trúc JSON khác nhau, chúng ta sử dụng **Factory Pattern** kết hợp với `ngSwitch` (hoặc Dynamic Component Loader) để hiển thị Component tương ứng.

### Flow xử lý:
1.  **Fetch Data**: API trả về object `Question` bao gồm `question_type` và `content`.
2.  **Determine Component**: Frontend kiểm tra `question_type`.
3.  **Inject Data**: Truyền `content` (JSON đã parse) vào `@Input()` của Component game đó.

### Pseudo-code (Angular Example):

```typescript
// container.component.ts
@Component({
  template: `
    <ng-container [ngSwitch]="question.question_type">
      <!-- Dạng bài Sắp xếp -->
      <app-sorting-game *ngSwitchCase="'sorting'" 
                        [data]="question.content">
      </app-sorting-game>

      <!-- Dạng bài Tính toán -->
      <app-math-calculation *ngSwitchCase="'calculation'" 
                            [config]="question.content">
      </app-math-calculation>

      <!-- Dạng bài Tiếng Việt -->
      <app-flash-card *ngSwitchCase="'flashcard'" 
                      [items]="question.content.items">
      </app-flash-card>
    </ng-container>
  `
})
export class GameContainerComponent {
  @Input() question: QuestionData;
}
```

**Lợi ích:**
- **Mở rộng linh hoạt**: Thêm game mới chỉ cần thêm Component và update Switch Case, không ảnh hưởng Database.
- **Micro-frontend ready**: Dễ dàng tách các game thành các module riêng biệt.

---

## 2. JSON Payload Examples (Chi tiết từng Game)

Dưới đây là cấu trúc JSON thực tế được trích xuất từ các file config hiện tại của dự án. Cấu trúc này sẽ được lưu trong cột `content` của bảng `QUESTIONS`.

### 2.1. Phép Cộng (Dynamic Generation)
*File nguồn: `addition-config.json`*
Dạng bài này lưu *cấu hình* để sinh câu hỏi, không lưu câu hỏi tĩnh.

```json
{
    "title": "Phép Cộng",
    "instruction": "Bé hãy tính tổng của hai phép tính nhé!",
    "items": ["🍎", "🦆", "🦋", "⭐", "🍄", "🐙", "🐸", "🦁", "🐠", "🍪"],
    "totalQuestions": 10,
    "pointsPerQuestion": 10,
    "difficulty": {
        "minNumber": 2,
        "maxNumber": 10
    },
    "feedback": {
        "correct": ["Chính xác! Bé giỏi quá! 🎉", "Đúng rồi! 🌟"],
        "wrong": ["Ôi sai rồi. Thử lại nhé! 💪"]
    },
    "mascotPrompts": {
        "start": "Chào con! Hôm nay mình học cộng nhé!",
        "question": "Câu hỏi số {index}: {a} cộng {b} bằng bao nhiêu?"
    }
}
```

### 2.2. Phép Trừ (Dynamic Generation)
*File nguồn: `subtraction-config.json`*
Tương tự phép cộng, lưu cấu hình sinh đề.

```json
{
    "title": "Phép Trừ",
    "difficulty": {
        "minNumber": 1,
        "maxNumber": 10
    }
    // ... (các trường tương tự Addition)
}
```

### 2.3. So Sánh (Comparison)
*File nguồn: `comparison-config.json`*
Lưu cấu hình để sinh câu hỏi so sánh (Lớn hơn, Bé hơn, Bằng).

```json
{
    "title": "So Sánh",
    "instruction": "Chọn bên có số lượng nhiều hơn, ít hơn hoặc bằng nhau nhé!",
    "items": ["🍎", "🦅", "🦋", "⭐"],
    "difficulty": {
        "minNumber": 1,
        "maxNumber": 10
    }
}
```

### 2.4. Sắp Xếp (Sorting)
*File nguồn: `sorting-config.json`*
Danh sách câu hỏi tĩnh, định nghĩa rõ các số cần sắp xếp.

```json
{
    "title": "Sắp Xếp Số",
    "questions": [
        {
            "id": 1,
            "question": "Sắp xếp các số theo thứ tự từ bé đến lớn",
            "order": "asc",
            "items": [5, 2, 8, 1],
            "correctSequence": [1, 2, 5, 8]
        },
        {
            "id": 3,
            "question": "Số nào bé nhất?",
            "type": "find-min",
            "items": [12, 5, 20, 8],
            "correctSequence": [5]
        }
    ]
}
```

### 2.5. Hình Học (Shapes)
*File nguồn: `shapes-config.json`*
Danh sách câu hỏi trắc nghiệm nhận diện hình.

```json
{
    "title": "Hình Học",
    "questions": [
        {
            "id": 1,
            "question": "Hình nào là hình TRÒN?",
            "correctAnswer": "circle",
            "options": [
                { "id": "square", "icon": "🟥", "color": "text-red-500" },
                { "id": "circle", "icon": "🔴", "color": "text-blue-500" },
                { "id": "triangle", "icon": "🔺", "color": "text-yellow-500" }
            ]
        }
    ]
}
```

### 2.6. Logic (Pattern Finding)
*File nguồn: `logic-config.json`*
Câu hỏi tìm quy luật dãy số hoặc hình ảnh.

```json
{
    "title": "Logic",
    "questions": [
        {
            "id": 1,
            "question": "Hình nào tiếp theo: 🔴 🔵 🔴 🔵 ...",
            "sequence": ["🔴", "🔵", "🔴", "🔵", "❓"],
            "correctAnswer": "🔴",
            "options": ["🔴", "🔵", "🟢"]
        }
    ]
}
```

### 2.7. Xem Giờ (Time)
*File nguồn: `time-config.json`*
Câu hỏi trắc nghiệm xem đồng hồ.

```json
{
    "title": "Học Xem Giờ",
    "questions": [
        {
            "id": 1,
            "time": "07:00",
            "hour": 7,
            "minute": 0,
            "question": "Đồng hồ chỉ mấy giờ?",
            "options": ["7:00", "8:00", "6:00", "12:00"],
            "correctAnswer": "7:00"
        }
    ]
}
```

### 2.8. Điền Số (Fill in Blank)
*File nguồn: `fill-in-blank-config.json`*
Câu hình sinh câu hỏi điền số còn thiếu.

```json
{
    "title": "Điền Số",
    "difficulty": {
        "minNumber": 0,
        "maxNumber": 10
    },
    "mascotPrompts": {
        "question": "Câu hỏi số {index}: Số nào còn thiếu nhỉ?"
    }
}
```

### 2.9. Tiếng Việt (Proposed Structure - Flashcard)
*Đề xuất cho các bài học chữ cái, từ vựng*

```json
{
  "type": "flashcard",
  "items": [
    {
      "id": "a",
      "text": "a",
      "audio_url": "/assets/audio/vn/a.mp3",
      "example": {
        "word": "cá",
        "image_url": "/assets/images/fish.png"
      }
    }
  ]
}
```
