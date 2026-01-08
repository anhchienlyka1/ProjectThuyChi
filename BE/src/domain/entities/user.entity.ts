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
}
