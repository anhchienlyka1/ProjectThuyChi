import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { ComparisonConfig } from '../models/comparison-config.model';

@Injectable({
    providedIn: 'root'
})
export class ComparisonService {
    private http = inject(HttpClient);
    private dataUrl = 'assets/mock-data/comparison-config.json';

    getConfig(): Observable<ComparisonConfig> {
        return this.http.get<ComparisonConfig>(this.dataUrl).pipe(
            catchError(error => {
                console.error('Error loading comparison config:', error);
                throw error;
            })
        );
    }
}
