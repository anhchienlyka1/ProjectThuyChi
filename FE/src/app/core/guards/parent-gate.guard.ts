import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class ParentGateGuard implements CanActivate {
    private platformId = inject(PLATFORM_ID);
    constructor(private router: Router) { }

    canActivate(): boolean | UrlTree {
        if (!isPlatformBrowser(this.platformId)) {
            return false; // Don't allow access on server
        }

        // Check if parent has been verified in this session
        const verified = sessionStorage.getItem('parent_verified') === 'true';

        // Dev bypass for development
        const devBypass = localStorage.getItem('parent_dev_mode') === 'true';

        if (verified || devBypass) {
            return true;
        }

        // Redirect to parent gate page for verification
        return this.router.createUrlTree(['/parent-gate']);
    }
}
