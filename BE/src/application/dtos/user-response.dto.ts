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

    constructor(partial: Partial<UserResponseDto>) {
        Object.assign(this, partial);
    }
}
