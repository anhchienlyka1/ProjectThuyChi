import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ComparisonConfig } from '../models/comparison-config.model';

@Injectable({
    providedIn: 'root'
})
export class ComparisonService {

    private readonly MOCK_CONFIG: ComparisonConfig = {
        title: 'So Sánh Lớn Bé',
        instruction: 'Bé hãy chọn dấu > , < hoặc = nhé!',
        totalQuestions: 5,
        pointsPerQuestion: 10,
        difficulty: {
            minNumber: 1,
            maxNumber: 20
        },
        feedback: {
            correct: ['Giỏi quá!', 'Xuất sắc!', 'Đúng rồi!', 'Bé làm tốt lắm!'],
            wrong: ['Thử lại nhé!', 'Sai rồi bé ơi!', 'Cố lên nào!']
        },
        mascotPrompts: {
            start: 'Chào bé! Mình cùng so sánh nhé!',
            question: 'Câu hỏi số {index}: So sánh hai phép tính!'
        }
    };

    getConfig(): Observable<ComparisonConfig> {
        return of(this.MOCK_CONFIG);
    }
}
