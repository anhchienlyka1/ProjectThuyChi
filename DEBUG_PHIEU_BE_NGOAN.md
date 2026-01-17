# Hướng Dẫn Debug Tính Năng "Phiếu Bé Ngoan"

## Kiểm Tra Achievement Đã Được Seed

```bash
cd BE
npx ts-node scripts/check-achievement.ts
```

Kết quả mong đợi:

```
✅ Achievement "improvement-certificate" exists
```

## Các Trường Hợp Kiểm Tra

### Trường Hợp 1: Lần Đầu Làm Bài

- **Kết quả**: KHÔNG nhận Phiếu Bé Ngoan
- **Lý do**: Chưa có lần làm bài trước để so sánh
- **Log backend**: `ℹ️ No previous session to compare`

### Trường Hợp 2: Lần 2 - Cải Thiện Điểm Số

- **Điều kiện**:
  - Lần 1: 7/10 câu đúng
  - Lần 2: 9/10 câu đúng
- **Kết quả**: ✅ Nhận Phiếu Bé Ngoan
- **Log backend**:

  ```
  🔍 Previous session: { score: 7, duration: 120 }
  📊 Comparing sessions: { current: { score: 9, time: 130 }, previous: { score: 7, time: 120 } }
  ✅ Improved by score: 9 > 7
  🎖️ Awarding improvement certificate...
  ✨ Improvement achievement awarded!
  ```

### Trường Hợp 3: Lần 2 - Cải Thiện Thời Gian

- **Điều kiện**:
  - Lần 1: 8/10 câu đúng, 120 giây
  - Lần 2: 8/10 câu đúng, 90 giây
- **Kết quả**: ✅ Nhận Phiếu Bé Ngoan
- **Log backend**:

  ```
  🔍 Previous session: { score: 8, duration: 120 }
  📊 Comparing sessions: { current: { score: 8, time: 90 }, previous: { score: 8, time: 120 } }
  ✅ Improved by time: 90 < 120
  🎖️ Awarding improvement certificate...
  ✨ Improvement achievement awarded!
  ```

### Trường Hợp 4: Không Cải Thiện

- **Điều kiện**:
  - Lần 1: 9/10 câu đúng
  - Lần 2: 7/10 câu đúng
- **Kết quả**: ❌ KHÔNG nhận Phiếu
- **Log backend**:

  ```
  🔍 Previous session: { score: 9, duration: 100 }
  📊 Comparing sessions: { current: { score: 7, time: 110 }, previous: { score: 9, time: 100 } }
  ❌ No improvement detected
  ```

### Trường Hợp 5: Không Đủ Sao

- **Điều kiện**: Đạt dưới 50% (0 sao)
- **Kết quả**: ❌ KHÔNG nhận Phiếu
- **Log backend**: `ℹ️ Not enough stars to check for improvement (need at least 1 star)`

## Cách Xem Log Backend

### Windows PowerShell

Backend đang chạy ở terminal, bạn sẽ thấy log khi hoàn thành bài tập.

### Các Log Quan Trọng

1. `🔍 Previous session:` - Hiển thị kết quả lần trước
2. `📊 Comparing sessions:` - So sánh lần hiện tại với lần trước
3. `✅ Improved by score/time:` - Phát hiện cải thiện
4. `🎖️ Awarding improvement certificate...` - Đang trao phiếu
5. `✨ Improvement achievement awarded!` - Đã trao phiếu thành công

## Nếu Không Thấy Phiếu Bé Ngoan

### Bước 1: Kiểm tra console backend

Xem có log `🔍 Previous session:` không?

- **Có**: Tiếp tục bước 2
- **Không**: Backend chưa nhận được request, kiểm tra frontend

### Bước 2: Kiểm tra điều kiện

- Đã làm bài ít nhất 2 lần chưa?
- Lần 2 có cải thiện không? (nhiều câu đúng hơn HOẶC nhanh hơn)
- Đạt ít nhất 1 sao (≥50%) chưa?

### Bước 3: Kiểm tra log chi tiết

Xem log `📊 Comparing sessions:` để biết:

- Điểm hiện tại vs điểm trước
- Thời gian hiện tại vs thời gian trước
- Có phát hiện cải thiện không?

### Bước 4: Kiểm tra frontend

Mở Developer Console (F12) và xem:

- Response từ API có `improvementAchievement` không?
- Component có hiển thị thông báo không?

## Lưu Ý Quan Trọng

1. **Phải làm bài ít nhất 2 lần** mới có thể nhận Phiếu Bé Ngoan
2. **Phải cải thiện** so với lần trước (điểm cao hơn HOẶC nhanh hơn)
3. **Phải đạt ít nhất 1 sao** (≥50% câu đúng)
4. **Mỗi lần cải thiện đều được tặng** Phiếu Bé Ngoan mới

## Test Nhanh

1. Làm bài lần 1: Trả lời đúng 5/10 câu
2. Làm bài lần 2: Trả lời đúng 7/10 câu
3. Kiểm tra: Phải nhận được thông báo "🎉 Chúc mừng bé nhận được 1 Phiếu Bé Ngoan! ⭐"
