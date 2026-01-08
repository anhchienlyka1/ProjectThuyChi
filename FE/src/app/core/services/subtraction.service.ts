import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { SubtractionConfig } from '../models/subtraction-config.model';

@Injectable({
    providedIn: 'root'
})
export class SubtractionService {
    private http = inject(HttpClient);
    private dataUrl = 'assets/mock-data/subtraction-config.json';

    getConfig(): Observable<SubtractionConfig> {
        return this.http.get<SubtractionConfig>(this.dataUrl).pipe(
            catchError(error => {
                console.error('Error loading subtraction config:', error);
                throw error;
            })
        );
    }
}
