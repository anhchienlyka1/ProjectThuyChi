import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AdditionConfig } from '../models/addition-config.model';

@Injectable({
  providedIn: 'root'
})
export class AdditionService {

  private readonly MOCK_CONFIG: AdditionConfig = {
    title: 'Phép Cộng Vui Nhộn',
    instruction: 'Bé hãy chọn đáp án đúng nhé!',
    items: ['🍎', '🍌', '🍊', '🍪', '🎈', '⭐'],
    totalQuestions: 20,
    pointsPerQuestion: 10,
    difficulty: {
      minNumber: 1,
      maxNumber: 10
    },
    feedback: {
      correct: ['Giỏi quá!', 'Xuất sắc!', 'Đúng rồi!', 'Bé làm tốt lắm!'],
      wrong: ['Thử lại nhé!', 'Sai rồi bé ơi!', 'Cố lên nào!']
    },
    mascotPrompts: {
      start: 'Chào bé! Mình cùng học cộng nhé!',
      question: '{a} cộng {b} bằng mấy nhỉ?'
    }
  };

  getConfig(): Observable<AdditionConfig> {
    return of(this.MOCK_CONFIG);
  }
}
