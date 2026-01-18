import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class StudentGuard implements CanActivate {
    private authService = inject(AuthService);
    private router = inject(Router);

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
        const requestedUrl = state.url; // This is the actual URL being requested
        const isAuthenticated = this.authService.isAuthenticated();
        const isStudent = this.authService.isStudent();

        // Debug logging
        console.log('🔒 StudentGuard Check:', {
            requestedUrl,
            isAuthenticated,
            isStudent,
            currentUser: this.authService.currentUser()
        });

        // Allow access to login and home pages without authentication
        const publicUrls = ['/', '/home', '/login'];
        const isPublicRoute = publicUrls.includes(requestedUrl) ||
            requestedUrl.startsWith('/login?');

        if (isPublicRoute) {
            console.log('✅ Allowing access to public route');
            return true;
        }

        // For all other routes, check if user is authenticated and is a student
        if (isAuthenticated && isStudent) {
            console.log('✅ User authenticated as student, allowing access');
            return true;
        }

        // Redirect to home page if not authorized
        console.log('❌ Access denied, redirecting to /home');
        return this.router.createUrlTree(['/home']);
    }
}
