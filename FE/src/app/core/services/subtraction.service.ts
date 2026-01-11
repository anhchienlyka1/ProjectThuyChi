import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { SubtractionConfig } from '../models/subtraction-config.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SubtractionService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/questions`;

    getConfig(): Observable<SubtractionConfig> {
        return this.http.get<SubtractionConfig>(`${this.apiUrl}?levelId=subtraction`).pipe(
            catchError(error => {
                console.error('Error loading subtraction config:', error);
                throw error;
            })
        );
    }
}
