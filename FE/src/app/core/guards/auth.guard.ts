import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    private authService = inject(AuthService);
    private router = inject(Router);

    canActivate(): boolean | UrlTree {
        const isAuthenticated = this.authService.isAuthenticated(); // Call signal
        const isParent = this.authService.isParent(); // Call method

        // Debug logging
        console.log('🔒 AuthGuard (Parent) Check:', {
            isAuthenticated,
            isParent,
            currentUser: this.authService.currentUser()
        });

        // Check if user is authenticated and is a parent
        if (isAuthenticated && isParent) {
            console.log('✅ User authenticated as parent, allowing access');
            return true;
        }

        // Redirect to home page if not authorized
        console.log('❌ Parent access denied, redirecting to /home');
        return this.router.createUrlTree(['/home']);
    }
}
