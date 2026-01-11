import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { ComparisonConfig } from '../models/comparison-config.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ComparisonService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/questions`;

    getConfig(): Observable<ComparisonConfig> {
        return this.http.get<ComparisonConfig>(`${this.apiUrl}?levelId=comparison`).pipe(
            catchError(error => {
                console.error('Error loading comparison config:', error);
                throw error;
            })
        );
    }
}
