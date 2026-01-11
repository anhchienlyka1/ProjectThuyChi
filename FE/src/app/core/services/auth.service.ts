import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

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
    private readonly API_URL = environment.apiUrl;
    private readonly STORAGE_KEY = 'thuyChi_user';
    private readonly TOKEN_KEY = 'thuyChi_token';

    // Signal to track current user
    currentUser = signal<User | null>(null);
    isAuthenticated = signal<boolean>(false);

    constructor(private http: HttpClient) {
        // Load user from localStorage on service initialization
        this.loadUserFromStorage();
    }

    /**
     * Login user (student or parent)
     */
    async login(username: string, pinCode: string, type: 'student' | 'parent'): Promise<LoginResponse> {
        try {
            // For student login, we use PIN code
            // For parent login, we use PIN code
            const endpoint = type === 'student'
                ? `${this.API_URL}/auth/login/student`
                : `${this.API_URL}/auth/login/parent`;

            const response = await firstValueFrom(
                this.http.post<LoginResponse>(endpoint, {
                    username,
                    pinCode,
                    type
                })
            );

            if (response.success && response.user) {
                // Map backend response to frontend user model
                const backendUser = response.user as any;
                const mappedUser: User = {
                    id: backendUser.id,
                    username: backendUser.email || username, // Use email from BE or input username
                    fullName: backendUser.name || 'Người dùng', // Map name to fullName
                    email: backendUser.email,
                    role: type, // Set role based on login context
                    avatarUrl: backendUser.avatarUrl,
                    pinCode: backendUser.pinCode, // Might be undefined/protected
                    gender: backendUser.gender
                };

                // Update response.user with mapped user
                response.user = mappedUser;

                // Save user to storage and update signals
                this.setUser(mappedUser, response.token);
            }

            return response;
        } catch (error: any) {
            console.error('Login error:', error);

            // Handle different error scenarios
            if (error.status === 401) {
                return {
                    success: false,
                    message: 'Tên đăng nhập hoặc mã PIN không đúng!'
                };
            } else if (error.status === 404) {
                return {
                    success: false,
                    message: 'Không tìm thấy tài khoản!'
                };
            } else {
                return {
                    success: false,
                    message: 'Có lỗi xảy ra. Vui lòng thử lại sau!'
                };
            }
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
     * Update user profile
     */
    async updateProfile(updates: Partial<User>): Promise<boolean> {
        try {
            const currentUser = this.currentUser();
            if (!currentUser) return false;

            const response = await firstValueFrom(
                this.http.put<{ success: boolean; user: User }>(
                    `${this.API_URL}/users/${currentUser.id}`,
                    updates
                )
            );

            if (response.success && response.user) {
                this.setUser(response.user);
                return true;
            }

            return false;
        } catch (error) {
            console.error('Update profile error:', error);
            return false;
        }
    }
}
