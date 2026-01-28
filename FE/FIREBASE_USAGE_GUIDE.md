# Hướng dẫn sử dụng Firebase trong dự án

## ✅ Đã hoàn thành

1. ✅ Cài đặt Firebase packages
2. ✅ Cấu hình Firebase trong environment files
3. ✅ Tạo Firebase Service
4. ✅ Tạo Firestore Service với các phương thức CRUD

## 📁 Cấu trúc files

```
src/
├── environments/
│   ├── environment.ts          # Config cho development
│   └── environment.prod.ts     # Config cho production
└── app/
    └── core/
        └── services/
            ├── firebase.service.ts    # Service khởi tạo Firebase
            └── firestore.service.ts   # Service làm việc với Firestore Database
```

## 🔥 Các tính năng Firebase đã setup

### 1. **Firestore Database** (Cơ sở dữ liệu)
- Thêm, sửa, xóa, đọc dữ liệu
- Query với điều kiện

### 2. **Authentication** (Xác thực người dùng)
- Đăng nhập/Đăng ký (cần implement thêm)

### 3. **Storage** (Lưu trữ file)
- Upload/Download hình ảnh, video (cần implement thêm)

### 4. **Analytics** (Phân tích)
- Theo dõi hành vi người dùng

## 📖 Cách sử dụng Firestore

### 1. Inject service vào component

```typescript
import { Component } from '@angular/core';
import { FirestoreService } from './core/services/firestore.service';

@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.component.html'
})
export class MyComponent {
  constructor(private db: FirestoreService) {}
}
```

### 2. Thêm dữ liệu (Create)

```typescript
async addStudent() {
  try {
    const studentData = {
      name: 'Nguyễn Văn A',
      age: 10,
      grade: 'Lớp 5',
      subjects: ['Toán', 'Tiếng Việt', 'Tiếng Anh']
    };
    
    const docId = await this.db.addDocument('students', studentData);
    console.log('Đã thêm học sinh với ID:', docId);
  } catch (error) {
    console.error('Lỗi khi thêm học sinh:', error);
  }
}
```

### 3. Đọc tất cả dữ liệu (Read All)

```typescript
async getAllStudents() {
  try {
    const students = await this.db.getAllDocuments('students');
    console.log('Danh sách học sinh:', students);
    return students;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách học sinh:', error);
    return [];
  }
}
```

### 4. Đọc một document theo ID (Read One)

```typescript
async getStudent(studentId: string) {
  try {
    const student = await this.db.getDocument('students', studentId);
    if (student) {
      console.log('Thông tin học sinh:', student);
    } else {
      console.log('Không tìm thấy học sinh');
    }
    return student;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin học sinh:', error);
    return null;
  }
}
```

### 5. Cập nhật dữ liệu (Update)

```typescript
async updateStudent(studentId: string) {
  try {
    await this.db.updateDocument('students', studentId, {
      age: 11,
      grade: 'Lớp 6'
    });
    console.log('Đã cập nhật thông tin học sinh');
  } catch (error) {
    console.error('Lỗi khi cập nhật học sinh:', error);
  }
}
```

### 6. Xóa dữ liệu (Delete)

```typescript
async deleteStudent(studentId: string) {
  try {
    await this.db.deleteDocument('students', studentId);
    console.log('Đã xóa học sinh');
  } catch (error) {
    console.error('Lỗi khi xóa học sinh:', error);
  }
}
```

### 7. Query với điều kiện (Query with conditions)

```typescript
import { where } from 'firebase/firestore';

async getStudentsByGrade(grade: string) {
  try {
    const students = await this.db.queryDocuments(
      'students',
      where('grade', '==', grade)
    );
    console.log('Học sinh lớp', grade, ':', students);
    return students;
  } catch (error) {
    console.error('Lỗi khi tìm kiếm học sinh:', error);
    return [];
  }
}

async getOlderStudents(minAge: number) {
  try {
    const students = await this.db.queryDocuments(
      'students',
      where('age', '>=', minAge)
    );
    console.log('Học sinh từ', minAge, 'tuổi trở lên:', students);
    return students;
  } catch (error) {
    console.error('Lỗi khi tìm kiếm học sinh:', error);
    return [];
  }
}
```

## 🎯 Ví dụ hoàn chỉnh trong Component

```typescript
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from './core/services/firestore.service';
import { where } from 'firebase/firestore';

interface Student {
  id?: string;
  name: string;
  age: number;
  grade: string;
  subjects: string[];
}

@Component({
  selector: 'app-student-list',
  template: `
    <div class="student-list">
      <h2>Danh sách học sinh</h2>
      
      <button (click)="loadStudents()">Tải danh sách</button>
      <button (click)="addNewStudent()">Thêm học sinh mới</button>
      
      <ul>
        <li *ngFor="let student of students">
          {{ student.name }} - {{ student.grade }} ({{ student.age }} tuổi)
          <button (click)="editStudent(student.id!)">Sửa</button>
          <button (click)="removeStudent(student.id!)">Xóa</button>
        </li>
      </ul>
    </div>
  `
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  
  constructor(private db: FirestoreService) {}
  
  ngOnInit() {
    this.loadStudents();
  }
  
  async loadStudents() {
    this.students = await this.db.getAllDocuments('students') as Student[];
  }
  
  async addNewStudent() {
    const newStudent: Student = {
      name: 'Trần Thị B',
      age: 9,
      grade: 'Lớp 4',
      subjects: ['Toán', 'Tiếng Việt']
    };
    
    try {
      await this.db.addDocument('students', newStudent);
      await this.loadStudents(); // Reload danh sách
      alert('Đã thêm học sinh mới!');
    } catch (error) {
      alert('Có lỗi xảy ra!');
    }
  }
  
  async editStudent(studentId: string) {
    try {
      await this.db.updateDocument('students', studentId, {
        age: 10
      });
      await this.loadStudents(); // Reload danh sách
      alert('Đã cập nhật!');
    } catch (error) {
      alert('Có lỗi xảy ra!');
    }
  }
  
  async removeStudent(studentId: string) {
    if (confirm('Bạn có chắc muốn xóa học sinh này?')) {
      try {
        await this.db.deleteDocument('students', studentId);
        await this.loadStudents(); // Reload danh sách
        alert('Đã xóa!');
      } catch (error) {
        alert('Có lỗi xảy ra!');
      }
    }
  }
}
```

## 🔐 Cấu hình Firestore Rules

Hiện tại bạn đang dùng **Test Mode** (cho phép mọi người đọc/ghi trong 30 ngày).

Để bảo mật hơn, vào **Firebase Console** > **Firestore Database** > **Rules** và thay đổi:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Cho phép đọc/ghi nếu đã đăng nhập
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 📊 Cấu trúc Collection nên dùng

```
students/                    # Collection học sinh
  ├── studentId1/
  │   ├── name: string
  │   ├── age: number
  │   ├── grade: string
  │   ├── subjects: array
  │   ├── createdAt: timestamp
  │   └── updatedAt: timestamp
  │
  └── studentId2/
      └── ...

lessons/                     # Collection bài học
  ├── lessonId1/
  │   ├── title: string
  │   ├── content: string
  │   ├── subject: string
  │   ├── grade: string
  │   └── ...

progress/                    # Collection tiến độ học tập
  ├── progressId1/
  │   ├── studentId: string
  │   ├── lessonId: string
  │   ├── score: number
  │   ├── completedAt: timestamp
  │   └── ...
```

## 🚀 Bước tiếp theo

1. **Xem dữ liệu trên Firebase Console:**
   - Truy cập: https://console.firebase.google.com/
   - Chọn dự án "turing-link-205616"
   - Vào **Build** > **Firestore Database**
   - Xem các collection và documents đã tạo

2. **Implement Authentication** (nếu cần):
   - Tạo AuthService
   - Đăng ký/Đăng nhập người dùng
   - Quản lý session

3. **Implement Storage** (nếu cần upload file):
   - Upload hình ảnh
   - Upload tài liệu PDF
   - Quản lý file

## ⚠️ Lưu ý quan trọng

1. **API Keys**: Các API keys trong config đã được public, đây là bình thường với Firebase. Bảo mật được kiểm soát qua **Firestore Rules**.

2. **Test Mode**: Nhớ thay đổi Firestore Rules sau 30 ngày để tránh bị lộ dữ liệu.

3. **Async/Await**: Tất cả các phương thức database đều là async, nhớ dùng `await` hoặc `.then()`.

4. **Error Handling**: Luôn bọc trong try-catch để xử lý lỗi.

## 📞 Cần giúp đỡ?

Nếu cần thêm tính năng hoặc có lỗi, hãy hỏi tôi!

### Các tính năng có thể implement thêm:
- 🔐 Authentication (Đăng nhập/Đăng ký)
- 📁 Storage (Upload file/hình ảnh)
- 🔔 Realtime Updates (Cập nhật theo thời gian thực)
- 📊 Complex Queries (Truy vấn phức tạp hơn)
- 🎨 CRUD UI Components (Giao diện quản lý dữ liệu)
