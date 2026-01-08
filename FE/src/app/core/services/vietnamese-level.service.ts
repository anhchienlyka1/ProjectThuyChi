import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { VietnameseLevel } from '../models/vietnamese-level.model';

@Injectable({
    providedIn: 'root'
})
export class VietnameseLevelService {
    private http = inject(HttpClient);
    private dataUrl = 'assets/mock-data/vietnamese-levels.json';

    getLevels(): Observable<VietnameseLevel[]> {
        return this.http.get<VietnameseLevel[]>(this.dataUrl).pipe(
            catchError(error => {
                console.error('Error loading vietnamese levels:', error);
                return of([]);
            })
        );
    }
}
