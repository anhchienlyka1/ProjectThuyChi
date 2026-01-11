/**
 * Response DTO - User
 * Dùng để format response trả về client
 */
export class UserResponseDto {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    pinCode?: string; // Mã PIN (có thể ẩn trong production)
    hasPinCode?: boolean; // Flag để check user có PIN hay chưa
    gender?: string; // Giới tính: 'male', 'female', 'other'
    parentId?: string;

    constructor(partial: Partial<UserResponseDto>) {
        Object.assign(this, partial);
    }

    static fromEntity(user: any): UserResponseDto { // Use 'any' to avoid circular dependency or import User if possible
        return new UserResponseDto({
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            hasPinCode: !!user.pinCode,
            pinCode: user.pinCode,
            gender: user.gender,
            parentId: user.parentId,
        });
    }
}
