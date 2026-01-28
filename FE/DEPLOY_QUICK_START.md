# 🚀 Quick Deploy Commands

## Lần đầu tiên deploy

### 1. Đăng nhập Firebase
```bash
firebase login
```

### 2. Build + Deploy
```bash
npm run deploy:full
```

---

## Deploy lại (sau khi có thay đổi)

```bash
npm run deploy:full
```

Hoặc từng bước:

```bash
npm run build:prod
npm run deploy
```

---

## Files đã tạo

- ✅ `firebase.json` - Cấu hình hosting
- ✅ `.firebaserc` - Project ID
- ✅ `DEPLOYMENT_GUIDE.md` - Hướng dẫn chi tiết
- ✅ Scripts trong `package.json`:
  - `build:prod` - Build production
  - `deploy` - Deploy lên Firebase
  - `deploy:full` - Build + Deploy

---

## Website URL sau khi deploy

- `https://turing-link-205616.web.app`
- `https://turing-link-205616.firebaseapp.com`

---

**Xem DEPLOYMENT_GUIDE.md để biết thêm chi tiết!**
