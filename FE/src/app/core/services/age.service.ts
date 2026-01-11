
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AgeOption } from '../models/age.model';

@Injectable({
    providedIn: 'root'
})
export class AgeService {
    // Hardcoded age options since they are static configurations
    private ages: AgeOption[] = [
        {
            "value": 3,
            "label": "Tuổi",
            "color": "#f87171",
            "gradient": "linear-gradient(135deg, #fca5a5 0%, #ef4444 100%)"
        },
        {
            "value": 4,
            "label": "Tuổi",
            "color": "#fbbf24",
            "gradient": "linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%)"
        },
        {
            "value": 5,
            "label": "Tuổi",
            "color": "#34d399",
            "gradient": "linear-gradient(135deg, #6ee7b7 0%, #10b981 100%)"
        },
        {
            "value": 6,
            "label": "Tuổi",
            "color": "#60a5fa",
            "gradient": "linear-gradient(135deg, #93c5fd 0%, #3b82f6 100%)"
        },
        {
            "value": 7,
            "label": "Tuổi",
            "color": "#a78bfa",
            "gradient": "linear-gradient(135deg, #c4b5fd 0%, #8b5cf6 100%)"
        }
    ];

    private _selectedAge = 3;

    get selectedAge(): number {
        return this._selectedAge;
    }

    set selectedAge(age: number) {
        this._selectedAge = age;
    }

    getAges(): Observable<AgeOption[]> {
        // Return as observable to maintain compatibility
        return of(this.ages);
    }
}
