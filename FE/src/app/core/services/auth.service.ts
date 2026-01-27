import { Injectable, signal } from '@angular/core';
import { findUserByCredentials, getUserById } from '../mock-data/users.mock';

export interface User {
    id: string;
    username: string;
    fullName: string;
    email?: string;
    role: 'student' | 'parent';
    avatarUrl?: string;
    pinCode?: string;
    gender?: string;
}

export interface LoginResponse {
    success: boolean;
    message?: string;
    user?: User;
    token?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly STORAGE_KEY = 'thuyChi_user';
    private readonly TOKEN_KEY = 'thuyChi_token';

    // Signal to track current user
    currentUser = signal<User | null>(null);
    isAuthenticated = signal<boolean>(false);

    constructor() {
        // Load user from localStorage on service initialization
        this.loadUserFromStorage();
    }

    /**
     * Login user (student or parent) - Using Mock Data
     */
    async login(username: string, pinCode: string, type: 'student' | 'parent'): Promise<LoginResponse> {
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Find user in mock data
            const mockUser = findUserByCredentials(username, pinCode);

            if (!mockUser) {
                return {
                    success: false,
                    message: 'Tên đăng nhập hoặc mã PIN không đúng!'
                };
            }

            if (mockUser.role !== type) {
                return {
                    success: false,
                    message: 'Loại tài khoản không đúng!'
                };
            }

            // Create user object (without pinCode for security)
            const user: User = {
                id: mockUser.id,
                username: mockUser.username,
                fullName: mockUser.fullName,
                email: mockUser.email,
                role: mockUser.role,
                avatarUrl: mockUser.avatarUrl,
                gender: mockUser.gender
            };

            // Generate mock token
            const token = 'mock-jwt-token-' + mockUser.id;

            // Save user to storage and update signals
            this.setUser(user, token);

            return {
                success: true,
                message: 'Đăng nhập thành công!',
                user,
                token
            };
        } catch (error: any) {
            console.error('Login error:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra. Vui lòng thử lại sau!'
            };
        }
    }

    /**
     * Logout current user
     */
    logout(): void {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(this.STORAGE_KEY);
            localStorage.removeItem(this.TOKEN_KEY);
        }
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
    }

    /**
     * Set user and save to storage
     */
    private setUser(user: User, token?: string): void {
        this.currentUser.set(user);
        this.isAuthenticated.set(true);

        // Save to localStorage
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
            if (token) {
                localStorage.setItem(this.TOKEN_KEY, token);
            }
        }
    }

    /**
     * Load user from localStorage
     */
    private loadUserFromStorage(): void {
        if (typeof localStorage !== 'undefined') {
            const userJson = localStorage.getItem(this.STORAGE_KEY);
            if (userJson) {
                try {
                    const user = JSON.parse(userJson) as User;
                    this.currentUser.set(user);
                    this.isAuthenticated.set(true);
                } catch (error) {
                    console.error('Error loading user from storage:', error);
                    this.logout();
                }
            }
        }
    }

    /**
     * Get authentication token
     */
    getToken(): string | null {
        if (typeof localStorage !== 'undefined') {
            return localStorage.getItem(this.TOKEN_KEY);
        }
        return null;
    }

    /**
     * Check if user is student
     */
    isStudent(): boolean {
        return this.currentUser()?.role === 'student';
    }

    /**
     * Check if user is parent
     */
    isParent(): boolean {
        return this.currentUser()?.role === 'parent';
    }

    /**
     * Get current user ID
     */
    getUserId(): string | null {
        return this.currentUser()?.id || null;
    }

    /**
     * Update user profile - Using Mock Data
     */
    async updateProfile(updates: Partial<User>): Promise<boolean> {
        try {
            const currentUser = this.currentUser();
            if (!currentUser) return false;

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 300));

            // Update current user with new data
            const updatedUser = { ...currentUser, ...updates };
            this.setUser(updatedUser);

            return true;
        } catch (error) {
            console.error('Update profile error:', error);
            return false;
        }
    }
}
