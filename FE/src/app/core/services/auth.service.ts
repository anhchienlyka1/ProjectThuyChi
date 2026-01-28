import { Injectable, signal, inject } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { where } from 'firebase/firestore';

export interface User {
    id: string;
    username: string;
    fullName: string;
    email?: string;
    role: 'student' | 'parent';
    avatarUrl?: string;
    pinCode?: string;
    gender?: string;
    level?: number;
    xp?: number;
    totalStars?: number;
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
    private db = inject(FirestoreService);
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
     * Login user (student or parent) - Uses Firestore ONLY
     * Supports PIN-only login (Student) or Username+PIN login
     */
    async login(username: string, pinCode: string, type: 'student' | 'parent'): Promise<LoginResponse> {
        try {
            console.log(`[AuthService] Login request. Username: '${username}', Type: ${type}`);

            let users: any[] = [];

            if (username) {
                // Login by Username + PIN
                users = await this.db.queryDocuments(
                    'users',
                    where('username', '==', username.toLowerCase())
                );
            } else {
                // Login by PIN only (Student flow)
                users = await this.db.queryDocuments(
                    'users',
                    where('pinCode', '==', pinCode)
                );
            }

            if (users.length > 0) {
                const firestoreUser = users[0] as User;

                // If matched by username, verify PIN
                if (username && firestoreUser.pinCode !== pinCode) {
                    return {
                        success: false,
                        message: 'Mã PIN không đúng!'
                    };
                }

                // Check Role
                if (firestoreUser.role !== type) {
                    return {
                        success: false,
                        message: 'Loại tài khoản không đúng!'
                    };
                }

                return this.processSuccessfulLogin(firestoreUser);
            }

            return {
                success: false,
                message: username ? 'Tên đăng nhập không đúng!' : 'Mã PIN không đúng!'
            };

        } catch (error: any) {
            console.error('Login error:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra. Vui lòng thử lại sau!'
            };
        }
    }

    private processSuccessfulLogin(user: User): LoginResponse {
        const token = 'jwt-token-' + (user.id || user.username);

        // Save user to storage and update signals
        this.setUser(user, token);

        return {
            success: true,
            message: 'Đăng nhập thành công!',
            user,
            token
        };
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
     * Update user profile - Saves to Firestore
     */
    async updateProfile(updates: Partial<User>): Promise<boolean> {
        try {
            const currentUser = this.currentUser();
            if (!currentUser || !currentUser.id) return false;

            // Update in Firestore
            try {
                await this.db.updateDocument('users', currentUser.id, updates);
                console.log('[AuthService] Profile updated in Firestore');
            } catch (error) {
                console.error('[AuthService] Could not update Firestore:', error);
                return false;
            }

            // Update local state
            const updatedUser = { ...currentUser, ...updates };
            this.setUser(updatedUser);

            return true;
        } catch (error) {
            console.error('Update profile error:', error);
            return false;
        }
    }
}
