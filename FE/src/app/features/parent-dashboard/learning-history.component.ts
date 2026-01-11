import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface DetailedActivity {
    id: number;
    date: Date;
    subject: string;
    module: string;
    questions: QuestionResult[];
    totalDuration: number;
    score: number;
    totalQuestions: number;
}

interface QuestionResult {
    questionNumber: number;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    timeSpent: number; // in seconds
}

@Component({
    selector: 'app-learning-history',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="max-w-7xl mx-auto space-y-6">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">📚 Lịch sử học tập chi tiết</h1>
          <p class="text-white-500 mt-1">Xem chi tiết từng bài học của bé</p>
        </div>
        <button class="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg">
          📥 Xuất báo cáo
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Môn học</label>
            <select [(ngModel)]="selectedSubject" (change)="applyFilters()"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors">
              <option value="">Tất cả môn</option>
              <option value="Toán Học">🔢 Toán Học</option>
              <option value="Tiếng Việt">📝 Tiếng Việt</option>
              <option value="Tiếng Anh">🔤 Tiếng Anh</option>
              <option value="Trò Chơi">🎮 Trò Chơi</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Thời gian</label>
            <select [(ngModel)]="selectedTimeRange" (change)="applyFilters()"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors">
              <option value="all">Tất cả</option>
              <option value="today">Hôm nay</option>
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Kết quả</label>
            <select [(ngModel)]="selectedResult" (change)="applyFilters()"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors">
              <option value="">Tất cả</option>
              <option value="excellent">Xuất sắc (≥90%)</option>
              <option value="good">Tốt (70-89%)</option>
              <option value="average">Trung bình (50-69%)</option>
              <option value="needs-improvement">Cần cải thiện (<50%)</option>
            </select>
          </div>

          <div class="flex items-end">
            <button (click)="resetFilters()"
                    class="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
              🔄 Đặt lại
            </button>
          </div>

        </div>
      </div>

      <!-- Activities List -->
      <div class="space-y-4">
        @for (activity of filteredActivities(); track activity.id) {
          <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

            <!-- Activity Header -->
            <div class="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="bg-white rounded-xl p-3 shadow-md">
                    <span class="text-3xl">{{ getSubjectIcon(activity.subject) }}</span>
                  </div>
                  <div>
                    <h3 class="text-xl font-bold text-gray-800">{{ activity.module }}</h3>
                    <p class="text-sm text-gray-600 mt-1">
                      {{ activity.subject }} • {{ formatDate(activity.date) }} • {{ activity.totalDuration }} phút
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-3xl font-bold" [class]="getScoreColorClass(activity.score, activity.totalQuestions)">
                    {{ activity.score }}/{{ activity.totalQuestions }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ getScorePercentage(activity.score, activity.totalQuestions) }}%
                  </div>
                </div>
              </div>
            </div>

            <!-- Questions Details -->
            <div class="p-6">
              <h4 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>📝</span>
                <span>Chi tiết từng câu hỏi</span>
              </h4>

              <div class="space-y-3">
                @for (question of activity.questions; track question.questionNumber) {
                  <div class="flex items-start gap-4 p-4 rounded-xl border-2 transition-all"
                       [class]="question.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'">

                    <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                         [class]="question.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'">
                      {{ question.questionNumber }}
                    </div>

                    <div class="flex-1">
                      <p class="font-semibold text-gray-800 mb-2">{{ question.question }}</p>

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div class="flex items-center gap-2">
                          <span class="font-semibold text-gray-600">Câu trả lời của bé:</span>
                          <span class="px-3 py-1 rounded-lg font-bold"
                                [class]="question.isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'">
                            {{ question.userAnswer }}
                          </span>
                        </div>

                        @if (!question.isCorrect) {
                          <div class="flex items-center gap-2">
                            <span class="font-semibold text-gray-600">Đáp án đúng:</span>
                            <span class="px-3 py-1 bg-green-200 text-green-800 rounded-lg font-bold">
                              {{ question.correctAnswer }}
                            </span>
                          </div>
                        }
                      </div>

                      <div class="mt-2 flex items-center gap-4 text-xs text-gray-500">
                        <span>⏱️ {{ question.timeSpent }}s</span>
                        <span [class]="question.isCorrect ? 'text-green-600' : 'text-red-600'">
                          {{ question.isCorrect ? '✅ Đúng' : '❌ Sai' }}
                        </span>
                      </div>
                    </div>

                  </div>
                }
              </div>

              <!-- Summary Stats -->
              <div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
                  <div class="text-2xl font-bold text-blue-600">{{ activity.totalQuestions }}</div>
                  <div class="text-xs text-gray-600 mt-1">Tổng số câu</div>
                </div>
                <div class="bg-green-50 rounded-xl p-4 text-center border border-green-100">
                  <div class="text-2xl font-bold text-green-600">{{ activity.score }}</div>
                  <div class="text-xs text-gray-600 mt-1">Câu đúng</div>
                </div>
                <div class="bg-red-50 rounded-xl p-4 text-center border border-red-100">
                  <div class="text-2xl font-bold text-red-600">{{ activity.totalQuestions - activity.score }}</div>
                  <div class="text-xs text-gray-600 mt-1">Câu sai</div>
                </div>
                <div class="bg-purple-50 rounded-xl p-4 text-center border border-purple-100">
                  <div class="text-2xl font-bold text-purple-600">{{ getAverageTime(activity.questions) }}s</div>
                  <div class="text-xs text-gray-600 mt-1">TB mỗi câu</div>
                </div>
              </div>

            </div>

          </div>
        }

        @if (filteredActivities().length === 0) {
          <div class="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100">
            <div class="text-6xl mb-4">📭</div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">Không tìm thấy kết quả</h3>
            <p class="text-gray-500">Thử thay đổi bộ lọc để xem thêm dữ liệu</p>
          </div>
        }
      </div>

    </div>
  `,
    styles: [`
    :host {
      display: block;
    }
  `]
})
export class LearningHistoryComponent {

    selectedSubject = signal('');
    selectedTimeRange = signal('all');
    selectedResult = signal('');

    // Mock data
    activities = signal<DetailedActivity[]>([
        {
            id: 1,
            date: new Date(Date.now() - 1000 * 60 * 60 * 2),
            subject: 'Toán Học',
            module: 'Phép Cộng 1-10',
            totalDuration: 12,
            score: 9,
            totalQuestions: 10,
            questions: [
                { questionNumber: 1, question: '2 + 3 = ?', userAnswer: '5', correctAnswer: '5', isCorrect: true, timeSpent: 8 },
                { questionNumber: 2, question: '5 + 4 = ?', userAnswer: '9', correctAnswer: '9', isCorrect: true, timeSpent: 6 },
                { questionNumber: 3, question: '1 + 7 = ?', userAnswer: '8', correctAnswer: '8', isCorrect: true, timeSpent: 5 },
                { questionNumber: 4, question: '6 + 3 = ?', userAnswer: '9', correctAnswer: '9', isCorrect: true, timeSpent: 7 },
                { questionNumber: 5, question: '4 + 5 = ?', userAnswer: '8', correctAnswer: '9', isCorrect: false, timeSpent: 12 },
                { questionNumber: 6, question: '3 + 6 = ?', userAnswer: '9', correctAnswer: '9', isCorrect: true, timeSpent: 6 },
                { questionNumber: 7, question: '7 + 2 = ?', userAnswer: '9', correctAnswer: '9', isCorrect: true, timeSpent: 5 },
                { questionNumber: 8, question: '8 + 1 = ?', userAnswer: '9', correctAnswer: '9', isCorrect: true, timeSpent: 4 },
                { questionNumber: 9, question: '2 + 7 = ?', userAnswer: '9', correctAnswer: '9', isCorrect: true, timeSpent: 6 },
                { questionNumber: 10, question: '5 + 5 = ?', userAnswer: '10', correctAnswer: '10', isCorrect: true, timeSpent: 5 }
            ]
        },
        {
            id: 2,
            date: new Date(Date.now() - 1000 * 60 * 60 * 24),
            subject: 'Tiếng Việt',
            module: 'Bảng Chữ Cái',
            totalDuration: 15,
            score: 8,
            totalQuestions: 10,
            questions: [
                { questionNumber: 1, question: 'Chữ cái đầu tiên trong bảng chữ cái là gì?', userAnswer: 'A', correctAnswer: 'A', isCorrect: true, timeSpent: 10 },
                { questionNumber: 2, question: 'Chữ cái sau B là gì?', userAnswer: 'C', correctAnswer: 'C', isCorrect: true, timeSpent: 8 },
                { questionNumber: 3, question: 'Chữ cái trước E là gì?', userAnswer: 'D', correctAnswer: 'D', isCorrect: true, timeSpent: 9 },
                { questionNumber: 4, question: 'Chữ cái sau F là gì?', userAnswer: 'H', correctAnswer: 'G', isCorrect: false, timeSpent: 15 },
                { questionNumber: 5, question: 'Chữ cái cuối cùng là gì?', userAnswer: 'Y', correctAnswer: 'Z', isCorrect: false, timeSpent: 12 },
                { questionNumber: 6, question: 'Chữ cái sau M là gì?', userAnswer: 'N', correctAnswer: 'N', isCorrect: true, timeSpent: 7 },
                { questionNumber: 7, question: 'Chữ cái trước P là gì?', userAnswer: 'O', correctAnswer: 'O', isCorrect: true, timeSpent: 8 },
                { questionNumber: 8, question: 'Chữ cái sau Q là gì?', userAnswer: 'R', correctAnswer: 'R', isCorrect: true, timeSpent: 6 },
                { questionNumber: 9, question: 'Chữ cái trước T là gì?', userAnswer: 'S', correctAnswer: 'S', isCorrect: true, timeSpent: 7 },
                { questionNumber: 10, question: 'Chữ cái sau W là gì?', userAnswer: 'X', correctAnswer: 'X', isCorrect: true, timeSpent: 8 }
            ]
        }
    ]);

    filteredActivities = signal<DetailedActivity[]>(this.activities());

    applyFilters(): void {
        let filtered = this.activities();

        // Filter by subject
        if (this.selectedSubject()) {
            filtered = filtered.filter(a => a.subject === this.selectedSubject());
        }

        // Filter by time range
        const now = new Date();
        if (this.selectedTimeRange() === 'today') {
            filtered = filtered.filter(a => a.date.toDateString() === now.toDateString());
        } else if (this.selectedTimeRange() === 'week') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filtered = filtered.filter(a => a.date >= weekAgo);
        } else if (this.selectedTimeRange() === 'month') {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            filtered = filtered.filter(a => a.date >= monthAgo);
        }

        // Filter by result
        if (this.selectedResult()) {
            filtered = filtered.filter(a => {
                const percentage = (a.score / a.totalQuestions) * 100;
                switch (this.selectedResult()) {
                    case 'excellent': return percentage >= 90;
                    case 'good': return percentage >= 70 && percentage < 90;
                    case 'average': return percentage >= 50 && percentage < 70;
                    case 'needs-improvement': return percentage < 50;
                    default: return true;
                }
            });
        }

        this.filteredActivities.set(filtered);
    }

    resetFilters(): void {
        this.selectedSubject.set('');
        this.selectedTimeRange.set('all');
        this.selectedResult.set('');
        this.filteredActivities.set(this.activities());
    }

    formatDate(date: Date): string {
        return new Intl.DateTimeFormat('vi-VN', {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }

    getSubjectIcon(subject: string): string {
        const icons: Record<string, string> = {
            'Toán Học': '🔢',
            'Tiếng Việt': '📝',
            'Tiếng Anh': '🔤',
            'Trò Chơi': '🎮'
        };
        return icons[subject] || '📚';
    }

    getScorePercentage(score: number, total: number): number {
        return Math.round((score / total) * 100);
    }

    getScoreColorClass(score: number, total: number): string {
        const percentage = (score / total) * 100;
        if (percentage >= 90) return 'text-green-600';
        if (percentage >= 70) return 'text-blue-600';
        if (percentage >= 50) return 'text-yellow-600';
        return 'text-red-600';
    }

    getAverageTime(questions: QuestionResult[]): number {
        const total = questions.reduce((sum, q) => sum + q.timeSpent, 0);
        return Math.round(total / questions.length);
    }
}
