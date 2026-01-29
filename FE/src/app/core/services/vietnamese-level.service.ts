import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { VietnameseLevel } from '../models/vietnamese-level.model';
import { AuthService } from './auth.service';
import { MOCK_VIETNAMESE_LEVELS } from '../initial-data/levels.mock';

@Injectable({
    providedIn: 'root'
})
export class VietnameseLevelService {
    private authService = inject(AuthService);

    getLevels(): Observable<VietnameseLevel[]> {
        const userId = this.authService.getUserId();
        if (!userId) {
            console.warn('[VietnameseLevelService] No user logged in');
            return of([]);
        }

        return of(MOCK_VIETNAMESE_LEVELS);
    }
}
