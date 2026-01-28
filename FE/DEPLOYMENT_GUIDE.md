# 🚀 Hướng dẫn Deploy lên Firebase Hosting

## ✅ Đã chuẩn bị sẵn

- ✅ Firebase CLI đã cài đặt
- ✅ File cấu hình `firebase.json` đã tạo
- ✅ File `.firebaserc` với project ID
- ✅ Deployment scripts trong `package.json`

## 📋 Các bước Deploy

### Bước 1: Đăng nhập Firebase

Mở terminal và chạy lệnh:

```bash
firebase login
```

**Sẽ mở trình duyệt để bạn đăng nhập:**
1. Chọn tài khoản Google của bạn
2. Cho phép Firebase CLI truy cập
3. Đóng trình duyệt khi thấy "Success!"

**Kiểm tra đăng nhập:**
```bash
firebase projects:list
```

Bạn sẽ thấy project `turing-link-205616` trong danh sách.

---

### Bước 2: Build Production

Chạy lệnh để build production:

```bash
npm run build:prod
```

**Sẽ mất vài phút.** Khi xong, bạn sẽ thấy folder `dist/project-thuy-chi/browser/` được tạo.

**Kiểm tra build:**
```bash
ls -la dist/project-thuy-chi/browser/
```

Bạn sẽ thấy các files: `index.html`, `main-*.js`, `styles-*.css`, v.v.

---

### Bước 3: Deploy lên Firebase

Deploy lên Firebase Hosting:

```bash
npm run deploy
```

Hoặc build + deploy cùng lúc:

```bash
npm run deploy:full
```

**Output sẽ giống như:**
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/turing-link-205616/overview
Hosting URL: https://turing-link-205616.web.app
```

---

### Bước 4: Truy cập website

Sau khi deploy xong, bạn có thể truy cập:

**URL mặc định:**
- `https://turing-link-205616.web.app`
- `https://turing-link-205616.firebaseapp.com`

🎉 **Xong! Website của bạn đã live trên Internet!**

---

## 🔧 Các lệnh hữu ích

### Test local trước khi deploy
```bash
firebase serve
```
Mở `http://localhost:5000` để xem

### Deploy lại (update)
```bash
npm run deploy:full
```

### Xem hosting history
```bash
firebase hosting:channel:list
```

### Rollback về version cũ
```bash
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL_ID TARGET_SITE_ID:live
```

---

## 🌐 Custom Domain (Tùy chọn)

Nếu bạn có tên miền riêng (ví dụ: `thuychi.com`):

1. Vào Firebase Console: https://console.firebase.google.com/
2. Chọn project `turing-link-205616`
3. Vào **Hosting** → **Add custom domain**
4. Nhập tên miền của bạn
5. Thêm DNS records theo hướng dẫn
6. Chờ SSL certificate tự động được tạo (vài phút đến vài giờ)

---

## 🔒 Bảo mật & Performance

### Firestore Rules
Hiện tại Firestore đang ở **Test Mode**. Để bảo mật:

1. Vào Firebase Console → **Firestore Database** → **Rules**
2. Thay đổi rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Performance Optimization

Firebase Hosting tự động có:
- ✅ Global CDN (tốc độ nhanh khắp thế giới)
- ✅ SSL/HTTPS miễn phí
- ✅ Gzip compression
- ✅ HTTP/2

---

## 🔄 CI/CD (Tương lai)

Để tự động deploy khi push code lên GitHub:

### 1. Tạo GitHub workflow

Tạo file `.github/workflows/firebase-hosting.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build:prod
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: turing-link-205616
```

### 2. Setup Firebase token

```bash
firebase login:ci
```

Copy token vào GitHub Secrets với tên `FIREBASE_SERVICE_ACCOUNT`.

---

## ❓ Troubleshooting

### Lỗi: "Permission denied"
```bash
firebase login --reauth
```

### Lỗi: "Project not found"
Kiểm tra file `.firebaserc` có đúng project ID không.

### Lỗi: Build failed
```bash
rm -rf node_modules dist
npm install
npm run build:prod
```

### Website không hiển thị đúng
1. Kiểm tra browser console (F12) xem có lỗi không
2. Hard refresh: `Cmd+Shift+R` (Mac) hoặc `Ctrl+Shift+R` (Windows)
3. Xóa cache browser

### Firebase config không hoạt động
Kiểm tra file `src/environments/environment.ts` có đúng Firebase config không.

---

## 📊 Monitoring

### Xem analytics
- Firebase Console → **Analytics** → **Dashboard**

### Xem hosting usage
- Firebase Console → **Hosting** → **Usage**

### Xem Firestore usage
- Firebase Console → **Firestore Database** → **Usage**

---

## 💰 Chi phí (Free Tier)

Firebase Hosting Free tier bao gồm:
- ✅ 10 GB storage
- ✅ 360 MB/day transfer
- ✅ Unlimited custom domains
- ✅ SSL certificates

**Nếu vượt quá:** Tự động nâng lên Blaze Plan (pay-as-you-go).

---

## 🎯 Next Steps

Sau khi deploy xong:

1. ✅ Share link với bạn bè/gia đình
2. ✅ Test trên mobile devices
3. ✅ Setup Analytics để theo dõi người dùng
4. ✅ Setup custom domain (nếu có)
5. ✅ Cập nhật Firestore rules để bảo mật

---

**🔥 Chúc mừng! Bạn đã deploy thành công dự án lên Internet!**

Nếu cần giúp đỡ, hãy hỏi tôi!
