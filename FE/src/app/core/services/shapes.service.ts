import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { ShapesConfig } from '../models/shapes-config.model';

@Injectable({
    providedIn: 'root'
})
export class ShapesService {
    private http = inject(HttpClient);
    private dataUrl = 'assets/mock-data/shapes-config.json';

    getConfig(): Observable<ShapesConfig> {
        return this.http.get<ShapesConfig>(this.dataUrl).pipe(
            catchError(error => {
                console.error('Error loading shapes config:', error);
                throw error;
            })
        );
    }
}
