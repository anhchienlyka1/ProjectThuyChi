import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-parent-gate',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-6">

      <!-- Gate Card -->
      <div class="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full transform transition-all">

        <!-- Icon -->
        <div class="text-center mb-8">
          <div class="inline-block bg-gradient-to-br from-purple-100 to-pink-100 rounded-full p-6 mb-4">
            <span class="text-6xl">👨‍👩‍👧</span>
          </div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Góc Phụ Huynh</h1>
          <p class="text-gray-600">Vui lòng giải bài toán để tiếp tục</p>
        </div>

        @if (!verified()) {
          <!-- Math Challenge -->
          <div class="space-y-6">

            <!-- Question -->
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 text-center border-2 border-purple-200">
              <p class="text-sm text-gray-600 mb-3">Bài toán xác thực:</p>
              <div class="text-4xl font-bold text-gray-800 mb-2">
                {{ num1() }} + {{ num2() }} = ?
              </div>
            </div>

            <!-- Answer Input -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Nhập câu trả lời:</label>
              <input
                type="number"
                [(ngModel)]="userAnswer"
                (keyup.enter)="checkAnswer()"
                placeholder="Nhập số..."
                class="w-full px-6 py-4 text-2xl text-center border-2 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors"
                [class.border-red-500]="showError()"
                [class.border-gray-300]="!showError()"
                autofocus>

              @if (showError()) {
                <p class="text-red-600 text-sm mt-2 flex items-center gap-2">
                  <span>❌</span>
                  <span>Sai rồi! Hãy thử lại nhé.</span>
                </p>
              }
            </div>

            <!-- Buttons -->
            <div class="space-y-3">
              <button
                (click)="checkAnswer()"
                class="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl transition-all hover:scale-105">
                ✓ Xác nhận
              </button>

              <button
                (click)="goBack()"
                class="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-colors">
                ← Quay lại
              </button>
            </div>

            <!-- Hint -->
            <div class="text-center">
              <p class="text-xs text-gray-500">
                💡 Chỉ phụ huynh mới có thể truy cập khu vực này
              </p>
            </div>

          </div>
        } @else {
          <!-- Success State -->
          <div class="text-center space-y-6 py-8">
            <div class="text-8xl animate-bounce">✅</div>
            <div>
              <h2 class="text-2xl font-bold text-green-600 mb-2">Chính xác!</h2>
              <p class="text-gray-600">Đang chuyển đến Góc Phụ Huynh...</p>
            </div>
            <div class="flex justify-center">
              <div class="animate-spin rounded-full h-8 w-8 border-4 border-purple-200 border-t-purple-600"></div>
            </div>
          </div>
        }

      </div>

    </div>
  `,
    styles: [`
    :host {
      display: block;
    }

    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-20px);
      }
    }

    .animate-bounce {
      animation: bounce 1s ease-in-out;
    }
  `]
})
export class ParentGateComponent {
    num1 = signal(Math.floor(Math.random() * 10) + 1);
    num2 = signal(Math.floor(Math.random() * 10) + 1);
    userAnswer = '';
    showError = signal(false);
    verified = signal(false);

    constructor(private router: Router) { }

    checkAnswer(): void {
        const correctAnswer = this.num1() + this.num2();
        const answer = parseInt(this.userAnswer, 10);

        if (answer === correctAnswer) {
            this.verified.set(true);
            this.showError.set(false);

            // Store verification in session
            sessionStorage.setItem('parent_verified', 'true');

            // Navigate to parent dashboard after a short delay
            setTimeout(() => {
                this.router.navigate(['/parents']);
            }, 1500);
        } else {
            this.showError.set(true);
            this.userAnswer = '';

            // Generate new question
            setTimeout(() => {
                this.num1.set(Math.floor(Math.random() * 10) + 1);
                this.num2.set(Math.floor(Math.random() * 10) + 1);
                this.showError.set(false);
            }, 2000);
        }
    }

    goBack(): void {
        this.router.navigate(['/']);
    }
}
