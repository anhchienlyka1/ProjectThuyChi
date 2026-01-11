import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { KidButtonComponent } from '../../../shared/ui-kit/kid-button/kid-button.component';
import { MascotService } from '../../../core/services/mascot.service';
import { SimpleWordsService, WordLevel } from '../../../core/services/simple-words.service';
import { DailyProgressService } from '../../../core/services/daily-progress.service';

@Component({
  selector: 'app-simple-words',
  standalone: true,
  imports: [CommonModule, KidButtonComponent],
  templateUrl: './simple-words.component.html',
  styleUrl: './simple-words.component.css'
})
export class SimpleWordsComponent implements OnInit {
  private simpleWordsService = inject(SimpleWordsService);
  private location = inject(Location);
  private router = inject(Router);
  private mascot = inject(MascotService);
  private dailyProgress = inject(DailyProgressService);

  levels: WordLevel[] = [];
  currentLevelIndex = 0;
  currentLevel!: WordLevel;

  // Game State
  userAnswer: (string | null)[] = [];
  shuffledOptions: { char: string, id: number, used: boolean }[] = [];

  isCorrect: boolean = false;
  isWrong: boolean = false;
  showFeedback: boolean = false;
  isFinished: boolean = false;

  ngOnInit(): void {
    this.mascot.setEmotion('happy', 'Chào con! Hãy ghép từ đúng nhé! 📚', 3000);
    this.loadLevelsFromAPI();
  }

  loadLevelsFromAPI() {
    this.simpleWordsService.getLevels().subscribe({
      next: (data) => {
        this.levels = data;
        if (this.levels.length > 0) {
          this.loadLevel();
        } else {
          console.warn('No simple words levels found in database');
        }
      },
      error: (err) => {
        console.error('Failed to load simple words levels:', err);
      }
    });
  }

  loadLevel() {
    this.currentLevel = this.levels[this.currentLevelIndex];
    this.userAnswer = Array(this.currentLevel.word.length).fill(null);
    this.isCorrect = false;
    this.isWrong = false;

    // Create options from the word characters + distractors if needed
    // For simplicity, just scramble the word characters for now
    const chars = this.currentLevel.word.split('');
    // Add logic to shuffle
    this.shuffledOptions = chars.map((char, index) => ({
      char,
      id: index,
      used: false
    })).sort(() => Math.random() - 0.5);

    this.mascot.setEmotion('thinking', `Bé hãy ghép từ: ${this.currentLevel.hint}`, 4000);
  }

  selectOption(option: { char: string, id: number, used: boolean }) {
    if (option.used || this.isCorrect) return;

    // Find first empty slot
    const emptyIndex = this.userAnswer.findIndex(slot => slot === null);
    if (emptyIndex !== -1) {
      this.userAnswer[emptyIndex] = option.char;
      option.used = true;
      this.playSound('pop');
      this.checkAnswer();
    }
  }

  removeLetter(index: number) {
    if (this.isCorrect || this.userAnswer[index] === null) return;

    const char = this.userAnswer[index];

    // Find the option ensuring we restore the correct "instance" of the letter
    // Ideally we should track optionId in userAnswer.
    // Heuristic: Find the first used option with this char and un-use it.

    const optionToRestore = this.shuffledOptions.find(o => o.char === char && o.used);

    // Only remove if we found where it came from (should always be true)
    if (optionToRestore) {
      this.userAnswer[index] = null;
      optionToRestore.used = false;
      this.playSound('click');
    }
  }

  checkAnswer() {
    // Check if full
    if (this.userAnswer.includes(null)) return;

    const formedWord = this.userAnswer.join('');
    if (formedWord === this.currentLevel.word) {
      this.isCorrect = true;
      this.playSound('success');
      this.mascot.celebrate();
      this.mascot.setEmotion('happy', 'Đúng rồi! Bé giỏi quá! 🎉', 2000);

      this.showFeedback = true;

      // Auto move next after delay
      setTimeout(() => {
        this.showFeedback = false;
        if (this.currentLevelIndex < this.levels.length - 1) {
          this.currentLevelIndex++;
          this.loadLevel();
        } else {
          // Finished all levels
          this.isFinished = true;
          // Increment daily completion count
          this.dailyProgress.incrementCompletion('simple-words');
          const completionCount = this.dailyProgress.getTodayCompletionCount('simple-words');
          this.mascot.setEmotion('celebrating', `Chúc mừng bé đã hoàn thành tất cả các bài! Đã hoàn thành ${completionCount} lần hôm nay! 🔥🏆`, 4000);
        }
      }, 2000);
    } else {
      this.isWrong = true;
      this.playSound('wrong');
      this.mascot.setEmotion('sad', 'Chưa đúng rồi, bé thử lại nhé! 🤔', 2000);

      this.showFeedback = true;

      setTimeout(() => {
        this.isWrong = false;
        this.showFeedback = false;
        this.resetCurrentLevel();
      }, 1500);
    }
  }

  resetCurrentLevel() {
    this.userAnswer = Array(this.currentLevel.word.length).fill(null);
    this.shuffledOptions.forEach(opt => opt.used = false);
  }

  restartGame() {
    this.currentLevelIndex = 0;
    this.isFinished = false;
    this.loadLevel();
  }

  goBack() {
    this.location.back();
  }

  playSound(type: 'pop' | 'click' | 'success' | 'wrong') {
    // Placeholder - implement real sound service call here
  }
}
