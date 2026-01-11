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
        // Check if user is authenticated and is a parent
        if (this.authService.isAuthenticated() && this.authService.isParent()) {
            return true;
        }

        // Redirect to parent login if not authorized
        return this.router.createUrlTree(['/login'], {
            queryParams: { type: 'parent', returnUrl: this.router.routerState.snapshot.url }
        });
    }
}
