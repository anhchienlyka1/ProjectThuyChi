# Hướng dẫn chi tiết cài đặt Firebase và lấy cấu hình (Config)

Tài liệu này sẽ hướng dẫn bạn từng bước để tạo dự án trên Firebase và lấy mã cấu hình để kết nối với ứng dụng.

## Bước 1: Truy cập Firebase Console
1. Mở trình duyệt và truy cập vào địa chỉ: [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Đăng nhập bằng tài khoản Google (Gmail) của bạn.

## Bước 2: Tạo dự án mới
1. Nhấn vào nút **"Create a project"** (hoặc "Add project").
2. **Nhập tên dự án**: Ví dụ `ProjectThuyChi-DB`.
3. Nhấn **Continue**.
4. Ở bước **Google Analytics**: Bạn có thể tắt (Disable) nó để đơn giản hóa quá trình cài đặt, hoặc để bật nếu muốn theo dõi người dùng. Sau đó nhấn **Create project**.
5. Chờ vài giây để Firebase khởi tạo, sau đó nhấn **Continue** để vào trang quản trị dự án.

## Bước 3: Tạo ứng dụng Web (Web App) để lấy Config
1. Tại trang chủ của dự án (Project Overview), bạn sẽ thấy các biểu tượng hình tròn (iOS, Android, Web, Unity...).
2. Nhấn vào biểu tượng **Web** (hình dấu ngoặc mã code `</>`).
3. **Register app (Đăng ký ứng dụng)**:
   - App nickname: Nhập tên tùy ý, ví dụ `ThuyChi-Web`.
   - **KHÔNG** cần tích vào ô "Also set up Firebase Hosting" lúc này.
   - Nhấn nút **Register app**.

## Bước 4: Lấy mã cấu hình (Firebase Config)
1. Sau khi đăng ký xong, màn hình sẽ hiện ra phần **"Add Firebase SDK"**.
2. Tìm đoạn mã trong thẻ `<script>` hoặc biến `const firebaseConfig`. Nó sẽ trông giống như sau:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD-xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "projectthuychi-db.firebaseapp.com",
  projectId: "projectthuychi-db",
  storageBucket: "projectthuychi-db.firebasestorage.app",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:xxxxxxxxxxxxxxxx"
};
```

3. **COPY toàn bộ nội dung bên trong `const firebaseConfig = { ... }` và gửi cho tôi.**

---

## Bước 5: Bật tính năng Database (Firestore)
Để lưu trữ dữ liệu, bạn cần kích hoạt Firestore Database.

1. Ở menu bên trái, chọn **Build** -> **Firestore Database**.
2. Nhấn nút **Create database**.
3. **Location**: Chọn vị trí server gần Việt Nam nhất (ví dụ: `asia-southeast1` - Singapore) để tốc độ nhanh. Nhấn **Next**.
4. **Secure rules (Quy tắc bảo mật)**:
   - Chọn **"Start in test mode"** (Chế độ thử nghiệm).
   - *Lưu ý: Chế độ này cho phép ai cũng có thể đọc/ghi dữ liệu trong 30 ngày. Chúng ta sẽ dùng chế độ này để phát triển cho nhanh, sau này sẽ chỉnh lại bảo mật sau.*
5. Nhấn **Create** (hoặc Enable).

Sau khi hoàn thành, bạn đã sẵn sàng để kết nối! Hãy gửi mã config ở **Bước 4** cho tôi nhé.
