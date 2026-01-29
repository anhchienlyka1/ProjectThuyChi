# ✅ Auto-Generate Title Feature

## 🎯 Feature: Tiêu đề tự động

Khi user chọn **loại bài tập** và **chủ đề**, tiêu đề sẽ tự động generate!

---

## 🔄 **Workflow:**

### 1. **Chọn loại bài tập:**
```
User chọn: "Từ Đơn"
→ Title auto: "Bài tập Từ Đơn"
```

### 2. **Nhập/chọn chủ đề:**
```
User nhập: "Động vật"
→ Title auto: "Bài tập Từ Đơn: Động vật"
```

### 3. **Thay đổi loại:**
```
User chọn: "Ghép Vần"
→ Title auto: "Bài tập Ghép Vần: Động vật"
```

---

## 💡 **Logic:**

```typescript
updateTitle(): void {
  const type = this.exerciseForm.get('type')?.value;
  const topic = this.exerciseForm.get('topic')?.value;
  
  let title = '';
  
  if (type === 'simple-words') {
    title = topic ? `Bài tập Từ Đơn: ${topic}` : 'Bài tập Từ Đơn';
  } else if (type === 'spelling') {
    title = topic ? `Bài tập Ghép Vần: ${topic}` : 'Bài tập Ghép Vần';
  } else if (type === 'fill-in-blank') {
    title = topic ? `Bài tập Điền Chữ: ${topic}` : 'Bài tập Điền Chữ';
  }
  
  this.exerciseForm.patchValue({ title }, { emitEvent: false });
}
```

---

## 🎬 **Triggers:**

Title tự động update khi:

1. ✅ **User chọn loại bài tập** (type change)
2. ✅ **User chọn suggested topic** (click button)
3. ✅ **User nhập custom topic** (input change)

---

## 📋 **Examples:**

| Type | Topic | Generated Title |
|------|-------|----------------|
| simple-words | (empty) | Bài tập Từ Đơn |
| simple-words | Động vật | Bài tập Từ Đơn: Động vật |
| spelling | Gia đình | Bài tập Ghép Vần: Gia đình |
| fill-in-blank | Đồ chơi | Bài tập Điền Chữ: Đồ chơi |

---

## 🔧 **Implementation:**

### Listeners:
```typescript
// In initForm()
this.exerciseForm.get('type')?.valueChanges.subscribe(() => {
  this.onTypeChange(); // → calls updateTitle()
});

this.exerciseForm.get('topic')?.valueChanges.subscribe(() => {
  this.updateTitle(); // → auto update title
});
```

### Methods:
```typescript
onTypeChange() {
  this.generatedQuestions = [];
  this.updateSuggestedTopics();
  this.exerciseForm.patchValue({ topic: '' });
  this.updateTitle(); // ← auto generate
}

selectTopic(topic: string) {
  this.exerciseForm.patchValue({ topic });
  this.updateTitle(); // ← auto generate
}
```

---

## ✅ **Benefits:**

1. **UX tốt hơn** - Không cần nhập title thủ công
2. **Consistency** - Format title đồng nhất
3. **Tiết kiệm thời gian** - 1 field ít hơn phải điền
4. **Real-time** - Update ngay khi chọn

---

## 🎨 **UI Display:**

```html
<!-- Title field (readonly or auto-filled) -->
<div class="form-group">
  <label>Tiêu đề</label>
  <input type="text" 
         formControlName="title" 
         readonly
         class="bg-gray-100"
         placeholder="Tự động tạo từ loại bài + chủ đề">
</div>

<!-- Or hide completely since it's auto -->
<input type="hidden" formControlName="title">
```

---

## ⚡ **Performance:**

- **No API calls** - Pure client-side logic
- **Instant** - Updates immediately
- **Reactive** - Angular's valueChanges
- **Clean** - No manual sync needed

---

**Status:** ✅ Complete  
**Date:** 2026-01-29  
**Version:** 1.1.0
