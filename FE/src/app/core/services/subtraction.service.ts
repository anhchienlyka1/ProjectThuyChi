import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SubtractionConfig } from '../models/subtraction-config.model';

@Injectable({
  providedIn: 'root'
})
export class SubtractionService {

  private readonly MOCK_CONFIG: SubtractionConfig = {
    title: 'Phép Trừ Vui Nhộn',
    instruction: 'Bé hãy chọn đáp án đúng nhé!',
    items: ['🍎', '🍌', '🍊', '🍪', '🎈', '⭐'],
    totalQuestions: 20,
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
      start: 'Chào bé! Mình cùng học trừ nhé!',
      question: '{a} trừ {b} bằng mấy nhỉ?'
    }
  };

  getConfig(): Observable<SubtractionConfig> {
    return of(this.MOCK_CONFIG);
  }
}
