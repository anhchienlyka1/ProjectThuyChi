import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { TimeConfig } from '../models/time-config.model';

@Injectable({
    providedIn: 'root'
})
export class TimeService {
    private http = inject(HttpClient);
    private dataUrl = 'assets/mock-data/time-config.json';

    getConfig(): Observable<TimeConfig> {
        return this.http.get<TimeConfig>(this.dataUrl).pipe(
            catchError(error => {
                console.error('Error loading time config:', error);
                throw error;
            })
        );
    }
}
