import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../core/services/firestore.service';
import { where } from 'firebase/firestore';

interface TestData {
    id?: string;
    name: string;
    value: number;
    createdAt?: string;
    updatedAt?: string;
}

@Component({
    selector: 'app-firebase-test',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="firebase-test-container">
      <h1>🔥 Firebase Firestore Test</h1>
      
      <div class="status">
        <p>Status: <span [class.success]="isConnected" [class.error]="!isConnected">
          {{ isConnected ? '✅ Connected' : '❌ Not Connected' }}
        </span></p>
      </div>

      <!-- Add Form -->
      <div class="card">
        <h2>➕ Thêm dữ liệu mới</h2>
        <div class="form-group">
          <label>Tên:</label>
          <input 
            type="text" 
            [(ngModel)]="newData.name" 
            placeholder="Nhập tên..."
          />
        </div>
        <div class="form-group">
          <label>Giá trị:</label>
          <input 
            type="number" 
            [(ngModel)]="newData.value" 
            placeholder="Nhập số..."
          />
        </div>
        <button (click)="addData()" class="btn btn-primary">
          Thêm vào Firestore
        </button>
      </div>

      <!-- Data List -->
      <div class="card">
        <h2>📋 Danh sách dữ liệu</h2>
        <button (click)="loadData()" class="btn btn-secondary">
          🔄 Tải lại
        </button>
        
        <div *ngIf="loading" class="loading">
          Đang tải...
        </div>

        <div *ngIf="!loading && dataList.length === 0" class="empty">
          Chưa có dữ liệu. Hãy thêm dữ liệu đầu tiên!
        </div>

        <ul class="data-list" *ngIf="!loading && dataList.length > 0">
          <li *ngFor="let item of dataList" class="data-item">
            <div class="data-info">
              <strong>{{ item.name }}</strong>
              <span class="value">Giá trị: {{ item.value }}</span>
              <span class="id">ID: {{ item.id }}</span>
            </div>
            <div class="data-actions">
              <button (click)="updateData(item)" class="btn btn-small btn-edit">
                ✏️ Sửa
              </button>
              <button (click)="deleteData(item.id!)" class="btn btn-small btn-delete">
                🗑️ Xóa
              </button>
            </div>
          </li>
        </ul>
      </div>

      <!-- Query Test -->
      <div class="card">
        <h2>🔍 Test Query</h2>
        <div class="form-group">
          <label>Tìm giá trị lớn hơn hoặc bằng:</label>
          <input 
            type="number" 
            [(ngModel)]="queryValue" 
            placeholder="Nhập số..."
          />
          <button (click)="queryData()" class="btn btn-secondary">
            Tìm kiếm
          </button>
        </div>
      </div>

      <!-- Message -->
      <div *ngIf="message" class="message" [class.success]="messageType === 'success'" [class.error]="messageType === 'error'">
        {{ message }}
      </div>
    </div>
  `,
    styles: [`
    .firebase-test-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 2rem;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    h1 {
      text-align: center;
      color: #ff6b35;
      margin-bottom: 2rem;
    }

    .status {
      text-align: center;
      margin-bottom: 2rem;
      font-size: 1.2rem;
    }

    .status .success {
      color: #4caf50;
      font-weight: bold;
    }

    .status .error {
      color: #f44336;
      font-weight: bold;
    }

    .card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    h2 {
      margin-top: 0;
      color: #333;
      font-size: 1.3rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #555;
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    input:focus {
      outline: none;
      border-color: #ff6b35;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s;
      font-weight: 500;
    }

    .btn-primary {
      background: #ff6b35;
      color: white;
    }

    .btn-primary:hover {
      background: #ff5722;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
    }

    .btn-secondary {
      background: #2196f3;
      color: white;
      margin-bottom: 1rem;
    }

    .btn-secondary:hover {
      background: #1976d2;
    }

    .btn-small {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
      margin-left: 0.5rem;
    }

    .btn-edit {
      background: #ffc107;
      color: #333;
    }

    .btn-edit:hover {
      background: #ffb300;
    }

    .btn-delete {
      background: #f44336;
      color: white;
    }

    .btn-delete:hover {
      background: #d32f2f;
    }

    .loading {
      text-align: center;
      padding: 2rem;
      color: #999;
    }

    .empty {
      text-align: center;
      padding: 2rem;
      color: #999;
      font-style: italic;
    }

    .data-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .data-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      margin-bottom: 0.75rem;
      background: #f5f5f5;
      border-radius: 8px;
      transition: transform 0.2s;
    }

    .data-item:hover {
      transform: translateX(5px);
      background: #eeeeee;
    }

    .data-info {
      flex: 1;
    }

    .data-info strong {
      display: block;
      font-size: 1.1rem;
      color: #333;
      margin-bottom: 0.25rem;
    }

    .data-info .value {
      display: block;
      color: #666;
      font-size: 0.95rem;
      margin-bottom: 0.25rem;
    }

    .data-info .id {
      display: block;
      color: #999;
      font-size: 0.85rem;
      font-family: monospace;
    }

    .data-actions {
      display: flex;
    }

    .message {
      padding: 1rem;
      border-radius: 8px;
      margin-top: 1rem;
      text-align: center;
      font-weight: 500;
      animation: slideIn 0.3s;
    }

    .message.success {
      background: #e8f5e9;
      color: #2e7d32;
      border: 1px solid #4caf50;
    }

    .message.error {
      background: #ffebee;
      color: #c62828;
      border: 1px solid #f44336;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class FirebaseTestComponent implements OnInit {
    isConnected = false;
    loading = false;
    message = '';
    messageType: 'success' | 'error' = 'success';

    newData: TestData = {
        name: '',
        value: 0
    };

    dataList: TestData[] = [];
    queryValue = 0;

    constructor(private db: FirestoreService) { }

    ngOnInit() {
        this.checkConnection();
        this.loadData();
    }

    checkConnection() {
        // Nếu FirestoreService được inject thành công, coi như đã kết nối
        this.isConnected = true;
    }

    async addData() {
        if (!this.newData.name || this.newData.value === undefined) {
            this.showMessage('Vui lòng nhập đầy đủ thông tin!', 'error');
            return;
        }

        try {
            const docId = await this.db.addDocument('test_data', {
                name: this.newData.name,
                value: this.newData.value
            });

            this.showMessage(`✅ Đã thêm thành công! ID: ${docId}`, 'success');

            // Reset form
            this.newData = { name: '', value: 0 };

            // Reload data
            await this.loadData();
        } catch (error) {
            console.error('Error adding data:', error);
            this.showMessage('❌ Có lỗi xảy ra khi thêm dữ liệu!', 'error');
        }
    }

    async loadData() {
        this.loading = true;
        try {
            this.dataList = await this.db.getAllDocuments('test_data') as TestData[];
            this.showMessage(`📋 Đã tải ${this.dataList.length} items`, 'success');
        } catch (error) {
            console.error('Error loading data:', error);
            this.showMessage('❌ Có lỗi xảy ra khi tải dữ liệu!', 'error');
        } finally {
            this.loading = false;
        }
    }

    async updateData(item: TestData) {
        if (!item.id) return;

        const newValue = prompt(`Nhập giá trị mới cho "${item.name}":`, item.value.toString());
        if (newValue === null) return;

        try {
            await this.db.updateDocument('test_data', item.id, {
                value: parseFloat(newValue)
            });

            this.showMessage('✅ Đã cập nhật thành công!', 'success');
            await this.loadData();
        } catch (error) {
            console.error('Error updating data:', error);
            this.showMessage('❌ Có lỗi xảy ra khi cập nhật!', 'error');
        }
    }

    async deleteData(itemId: string) {
        if (!confirm('Bạn có chắc muốn xóa item này?')) return;

        try {
            await this.db.deleteDocument('test_data', itemId);
            this.showMessage('✅ Đã xóa thành công!', 'success');
            await this.loadData();
        } catch (error) {
            console.error('Error deleting data:', error);
            this.showMessage('❌ Có lỗi xảy ra khi xóa!', 'error');
        }
    }

    async queryData() {
        this.loading = true;
        try {
            this.dataList = await this.db.queryDocuments(
                'test_data',
                where('value', '>=', this.queryValue)
            ) as TestData[];

            this.showMessage(`🔍 Tìm thấy ${this.dataList.length} items có giá trị >= ${this.queryValue}`, 'success');
        } catch (error) {
            console.error('Error querying data:', error);
            this.showMessage('❌ Có lỗi xảy ra khi tìm kiếm!', 'error');
        } finally {
            this.loading = false;
        }
    }

    showMessage(msg: string, type: 'success' | 'error') {
        this.message = msg;
        this.messageType = type;

        // Auto hide after 3 seconds
        setTimeout(() => {
            this.message = '';
        }, 3000);
    }
}
