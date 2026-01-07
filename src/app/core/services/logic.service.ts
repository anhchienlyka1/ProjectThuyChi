import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { LogicConfig } from '../models/logic-config.model';

@Injectable({
    providedIn: 'root'
})
export class LogicService {
    private http = inject(HttpClient);
    private dataUrl = 'assets/mock-data/logic-config.json';

    getConfig(): Observable<LogicConfig> {
        return this.http.get<LogicConfig>(this.dataUrl).pipe(
            catchError(error => {
                console.error('Error loading logic config:', error);
                throw error;
            })
        );
    }
}
