import { Injectable, signal, inject } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { where } from 'firebase/firestore';
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
     * Login user (student or parent) - Uses Firestore first, falls back to Mock Data
     */
    async login(username: string, pinCode: string, type: 'student' | 'parent'): Promise<LoginResponse> {
        try {
            console.log(`[AuthService] Attempting login for ${username}...`);

            // 1. Try to find user in Firestore
            try {
                const users = await this.db.queryDocuments(
                    'users',
                    where('username', '==', username.toLowerCase())
                );

                if (users.length > 0) {
                    const firestoreUser = users[0] as User;
                    console.log('[AuthService] User found in Firestore:', firestoreUser.username);

                    // Check PIN
                    if (firestoreUser.pinCode !== pinCode) {
                        return {
                            success: false,
                            message: 'Mã PIN không đúng!'
                        };
                    }

                    // Check Role (if specified, though registration sets it to student)
                    if (firestoreUser.role !== type) {
                        return {
                            success: false,
                            message: 'Loại tài khoản không đúng!'
                        };
                    }

                    // Login successful via Firestore
                    return this.processSuccessfulLogin(firestoreUser);
                }
            } catch (firestoreError) {
                console.warn('[AuthService] Firestore login failed, falling back to mock:', firestoreError);
            }

            // 2. Fallback to Mock Data if not found in Firestore or error
            console.log('[AuthService] User not found in Firestore, checking mock data...');
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

            // Login successful via Mock Data
            return this.processSuccessfulLogin({
                id: mockUser.id,
                username: mockUser.username,
                fullName: mockUser.fullName,
                email: mockUser.email,
                role: mockUser.role,
                avatarUrl: mockUser.avatarUrl,
                gender: mockUser.gender,
                pinCode: mockUser.pinCode // Keep pinCode internally for fallback logic consistency
            });

        } catch (error: any) {
            console.error('Login error:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra. Vui lòng thử lại sau!'
            };
        }
    }

    private processSuccessfulLogin(user: User): LoginResponse {
        // Create clean user object (remove sensitive data if strictly needed, but kept here for easy access)
        // Ensure ID is present. Firestore query returns objects which might not have 'id' field inside the data, 
        // effectively 'id' comes from the doc ID. FirestoreService queryDocuments adds 'id'.

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
     * Update user profile - Saves to Firestore if logged in via Firestore
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
                console.warn('[AuthService] Could not update Firestore (maybe mock user?), updating local only:', error);
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
