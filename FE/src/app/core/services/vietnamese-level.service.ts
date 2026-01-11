import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { VietnameseLevel } from '../models/vietnamese-level.model';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class VietnameseLevelService {
    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private apiUrl = `${environment.apiUrl}/levels`;

    getLevels(): Observable<VietnameseLevel[]> {
        const userId = this.authService.getUserId();
        if (!userId) {
            console.warn('[VietnameseLevelService] No user logged in');
            return of([]);
        }

        return this.http.get<VietnameseLevel[]>(`${this.apiUrl}?subjectId=vietnamese&userId=${userId}`).pipe(
            catchError(error => {
                console.error('Error loading vietnamese levels:', error);
                return of([]);
            })
        );
    }
}
