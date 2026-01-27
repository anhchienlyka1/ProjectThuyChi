import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { VietnameseLevel } from '../models/vietnamese-level.model';
import { AuthService } from './auth.service';
import { getLevelsBySubject } from '../mock-data/levels.mock';

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

        // Get mock levels
        const mockLevels = getLevelsBySubject('vietnamese', userId);

        // Return observable with simulated delay
        return of(mockLevels as VietnameseLevel[]).pipe(delay(300));
    }
}
