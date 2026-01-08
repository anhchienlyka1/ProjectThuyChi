import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { SortingConfig } from '../models/sorting-config.model';

@Injectable({
    providedIn: 'root'
})
export class SortingService {
    private http = inject(HttpClient);
    private dataUrl = 'assets/mock-data/sorting-config.json';

    getConfig(): Observable<SortingConfig> {
        return this.http.get<SortingConfig>(this.dataUrl).pipe(
            catchError(error => {
                console.error('Error loading sorting config:', error);
                throw error;
            })
        );
    }
}
