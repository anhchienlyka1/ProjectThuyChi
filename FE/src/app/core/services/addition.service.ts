import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { AdditionConfig } from '../models/addition-config.model';

@Injectable({
    providedIn: 'root'
})
export class AdditionService {
    private http = inject(HttpClient);
    private dataUrl = 'assets/mock-data/addition-config.json';

    getConfig(): Observable<AdditionConfig> {
        return this.http.get<AdditionConfig>(this.dataUrl).pipe(
            catchError(error => {
                console.error('Error loading addition config:', error);
                throw error;
            })
        );
    }
}
