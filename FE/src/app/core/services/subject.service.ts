import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SubjectCard } from '../models/subject.model';
import { MOCK_SUBJECTS } from '../initial-data/subjects.mock';

@Injectable({
    providedIn: 'root'
})
export class SubjectService {

    getSubjects(): Observable<SubjectCard[]> {
        return of(MOCK_SUBJECTS);
    }
}
