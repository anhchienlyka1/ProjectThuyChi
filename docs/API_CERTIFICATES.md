# API Documentation - Parent Dashboard Certificates

## Endpoint: GET /dashboard/certificates

### Mô tả

API này dùng để lấy danh sách các phiếu bé ngoan (certificates/achievements) của học sinh cho màn hình "Bộ Sưu Tập Phiếu Bé Ngoan" trong parent dashboard.

### URL

```
GET http://localhost:3000/api/dashboard/certificates
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | string | Yes | ID của học sinh cần lấy danh sách phiếu |
| limit | number | No | Số lượng phiếu tối đa trả về (pagination) |
| offset | number | No | Vị trí bắt đầu lấy dữ liệu (pagination) |

### Request Example

```bash
# Lấy tất cả phiếu của học sinh
GET /api/dashboard/certificates?userId=123e4567-e89b-12d3-a456-426614174000

# Lấy 10 phiếu đầu tiên
GET /api/dashboard/certificates?userId=123e4567-e89b-12d3-a456-426614174000&limit=10

# Lấy 10 phiếu tiếp theo (pagination)
GET /api/dashboard/certificates?userId=123e4567-e89b-12d3-a456-426614174000&limit=10&offset=10
```

### Response Format

```typescript
{
  certificates: [
    {
      id: number;                    // ID của user achievement
      achievementId: string;         // ID của achievement template
      title: string;                 // Tên phiếu (VD: "Phiếu Bé Ngoan Tuần 1")
      description: string;           // Mô tả thành tích
      icon: string;                  // Icon emoji (VD: "🌟")
      rarity: string;                // Độ hiếm: "common" | "rare" | "epic" | "legendary"
      earnedAt: Date;                // Ngày đạt được phiếu
      weekNumber: number;            // Số tuần trong năm
      isUnlocked: boolean;           // Trạng thái mở khóa (luôn true cho earned achievements)
      earnedContext: any;            // Thông tin bổ sung về cách đạt được
    }
  ],
  total: number;                     // Tổng số phiếu của học sinh
  hasMore: boolean;                  // Còn phiếu nữa không (cho pagination)
}
```

### Response Example

```json
{
  "certificates": [
    {
      "id": 1,
      "achievementId": "weekly-achievement-1",
      "title": "Phiếu Bé Ngoan Tuần 1",
      "description": "Hoàn thành xuất sắc bài tập tuần 1",
      "icon": "🌟",
      "rarity": "common",
      "earnedAt": "2026-01-08T10:30:00.000Z",
      "weekNumber": 2,
      "isUnlocked": true,
      "earnedContext": {
        "lessonsCompleted": 5,
        "avgScore": 95
      }
    },
    {
      "id": 2,
      "achievementId": "weekly-achievement-2",
      "title": "Phiếu Bé Ngoan Tuần 2",
      "description": "Chăm chỉ học toán mỗi ngày",
      "icon": "⭐",
      "rarity": "rare",
      "earnedAt": "2026-01-01T14:20:00.000Z",
      "weekNumber": 1,
      "isUnlocked": true,
      "earnedContext": {
        "subject": "math",
        "streak": 7
      }
    }
  ],
  "total": 2,
  "hasMore": false
}
```

### Error Responses

#### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "userId is required",
  "error": "Bad Request"
}
```

#### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

## Frontend Integration

### Service Method (DashboardService)

Bạn có thể thêm method này vào `dashboard.service.ts`:

```typescript
async getCertificates(userId: string, options?: { limit?: number; offset?: number }): Promise<CertificatesResponse> {
  const params = new URLSearchParams({ userId });
  
  if (options?.limit) {
    params.append('limit', options.limit.toString());
  }
  
  if (options?.offset) {
    params.append('offset', options.offset.toString());
  }
  
  return firstValueFrom(
    this.http.get<CertificatesResponse>(`${this.API_URL}/dashboard/certificates?${params}`)
  );
}
```

### TypeScript Interface

```typescript
export interface Certificate {
  id: number;
  achievementId: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: Date;
  weekNumber: number;
  isUnlocked: boolean;
  earnedContext?: any;
}

export interface CertificatesResponse {
  certificates: Certificate[];
  total: number;
  hasMore: boolean;
}
```

### Usage Example

```typescript
// Component
async loadCertificates() {
  const studentId = this.selectedStudent()?.id;
  
  if (studentId) {
    const response = await this.dashboardService.getCertificates(studentId, {
      limit: 20,
      offset: 0
    });
    
    this.certificates.set(response.certificates);
    this.totalCertificates.set(response.total);
  }
}

// Load more (pagination)
async loadMoreCertificates() {
  const studentId = this.selectedStudent()?.id;
  const currentCount = this.certificates().length;
  
  if (studentId) {
    const response = await this.dashboardService.getCertificates(studentId, {
      limit: 20,
      offset: currentCount
    });
    
    this.certificates.update(certs => [...certs, ...response.certificates]);
  }
}
```

## Database Schema Reference

API này sử dụng các bảng sau:

- `user_achievements`: Lưu trữ các achievement mà user đã đạt được
- `achievements`: Template của các achievement (title, description, icon, rarity)

## Notes

1. **Week Number Calculation**: Số tuần được tính từ đầu năm (ISO week number)
2. **Sorting**: Phiếu được sắp xếp theo thứ tự mới nhất trước (earnedAt DESC)
3. **Pagination**: Sử dụng limit và offset để phân trang
4. **isUnlocked**: Hiện tại luôn là `true` vì chỉ trả về các phiếu đã đạt được. Trong tương lai có thể mở rộng để hiển thị cả phiếu chưa đạt được (locked)

## Related APIs

- `GET /dashboard/parent-overview?childId={userId}` - Lấy tổng quan dashboard (bao gồm số lượng badges)
- `GET /student-profile/:userId/achievements` - Lấy achievements chi tiết hơn
- `GET /student-profile/:userId/weekly-achievements` - Lấy weekly achievements
