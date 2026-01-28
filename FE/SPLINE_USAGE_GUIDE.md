# Hướng dẫn sử dụng Spline 3D trong Project

Tôi đã cài đặt thư viện `@splinetool/viewer` và tạo một component dùng chung để bạn dễ dàng tích hợp các thiết kế 3D từ Spline vào ứng dụng.

## 1. Thành phần đã tạo: `SplineSceneComponent`

Vị trí: `src/app/shared/components/spline-scene.component.ts`

Component này bao bọc `spline-viewer` (Web Component của Spline) để sử dụng mượt mà trong Angular.

## 2. Cách sử dụng

### Bước 1: Import vào Component của bạn

Trong file `.ts` của component bạn muốn sử dụng (ví dụ: `HomeComponent`):

```typescript
import { SplineSceneComponent } from '../../shared/components/spline-scene.component';

@Component({
  // ...
  standalone: true,
  imports: [
    // ... các import khác
    SplineSceneComponent
  ],
})
export class YourComponent {
  // URL của scene bạn xuất từ Spline (chọn Export -> Public Link trong Spline Design)
  // Lưu ý: Nếu gặp lỗi AccessDenied, có thể link cũ đã hết hạn hoặc bị xóa. Hãy dùng link mới.
  sceneUrl = 'https://prod.spline.design/S8o9DE-254xyJ0lv/scene.splinecode';
}
```

### Bước 2: Thêm vào Template

Trong file `.html`:

```html
<div class="w-full h-[500px]">
  <app-spline-scene [sceneUrl]="sceneUrl"></app-spline-scene>
</div>
```

**Lưu ý:** Bạn cần đặt `app-spline-scene` bên trong một thẻ div có kích thước (width/height) xác định để scene hiển thị đúng.

## 3. Tùy chỉnh (Props)

- `sceneUrl` (required): Link `.splinecode` từ Spline.
- `loading`: `'auto' | 'lazy' | 'eager'` (mặc định là `lazy`).

## 4. Kiểm tra cài đặt

Tôi đã cài đặt thành công:
- `@splinetool/runtime`
- `@splinetool/viewer`

Chúc bạn có những thiết kế 3D tuyệt vời!

## 5. Component Tạo Sẵn: `Mascot3dComponent`

Vị trí: `src/app/shared/components/mascot-3d/mascot-3d.component.ts`

Đây là một ví dụ nâng cao sử dụng `SplineSceneComponent` để hiển thị nhân vật 3D có hội thoại.

