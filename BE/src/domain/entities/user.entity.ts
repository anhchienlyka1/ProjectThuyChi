/**
 * Domain Entity - User
 * Đây là core business entity, không phụ thuộc vào framework hay database
 */
export class User {
    constructor(
        public readonly id: string,
        public email: string,
        public name: string,
        public createdAt: Date,
        public updatedAt: Date,
        public pinCode?: string, // Mã PIN 6 số (optional)
        public gender?: string, // Giới tính: 'male', 'female', 'other' (optional)
        public parentId?: string, // ID của phụ huynh (nếu là con)
    ) { }

    // Business logic methods
    updateProfile(name: string): void {
        this.name = name;
        this.updatedAt = new Date();
    }

    isEmailValid(): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(this.email);
    }

    // Kiểm tra mã PIN có hợp lệ không (6 chữ số)
    isPinCodeValid(pin?: string): boolean {
        const pinToCheck = pin ?? this.pinCode;
        if (!pinToCheck) return false;
        const pinRegex = /^\d{6}$/; // Chính xác 6 chữ số
        return pinRegex.test(pinToCheck);
    }

    // Cập nhật mã PIN
    setPinCode(pin: string): void {
        if (!this.isPinCodeValid(pin)) {
            throw new Error('Mã PIN phải là 6 chữ số');
        }
        this.pinCode = pin;
        this.updatedAt = new Date();
    }

    // Xóa mã PIN
    clearPinCode(): void {
        this.pinCode = undefined;
        this.updatedAt = new Date();
    }

    // Kiểm tra giới tính có hợp lệ không
    isGenderValid(gender?: string): boolean {
        const genderToCheck = gender ?? this.gender;
        if (!genderToCheck) return false;
        const validGenders = ['male', 'female', 'other'];
        return validGenders.includes(genderToCheck.toLowerCase());
    }

    // Cập nhật giới tính
    setGender(gender: string): void {
        if (!this.isGenderValid(gender)) {
            throw new Error('Giới tính phải là "male", "female", hoặc "other"');
        }
        this.gender = gender.toLowerCase();
        this.updatedAt = new Date();
    }
}
