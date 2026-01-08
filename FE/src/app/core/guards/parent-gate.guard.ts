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

        // In a real app, we would show a modal here.
        // For now, let's use a simple browser prompt for the MVP
        // to satisfy the "Math Guard" requirement without complex UI overhead yet.

        // We can allow "admin" bypass for dev
        const devBypass = localStorage.getItem('parent_dev_mode') === 'true';
        if (devBypass) return true;

        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const answer = num1 + num2;

        const input = prompt(`Bài kiểm tra phụ huynh: ${num1} + ${num2} = ?`);

        if (input && parseInt(input, 10) === answer) {
            return true;
        } else {
            alert('Sai rồi! Chỉ phụ huynh mới được vào đây ạ.');
            this.router.navigate(['/']);
            return false;
        }
    }
}
