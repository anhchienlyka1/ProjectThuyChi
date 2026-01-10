import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

interface WordLevel {
  id: number;
  word: string;
  image: string; // Emoji for now
  hint: string;
}

import { KidButtonComponent } from '../../../shared/ui-kit/kid-button/kid-button.component';
import { MascotService } from '../../../core/services/mascot.service';

@Component({
  selector: 'app-simple-words',
  standalone: true,
  imports: [CommonModule, KidButtonComponent],
  templateUrl: './simple-words.component.html',
  styleUrl: './simple-words.component.css'
})
export class SimpleWordsComponent implements OnInit {
  levels: WordLevel[] = [
    { id: 1, word: 'CÁ', image: '🐟', hint: 'Con gì bơi dưới nước?' },
    { id: 2, word: 'GÀ', image: '🐔', hint: 'Con gì gáy ò ó o?' },
    { id: 3, word: 'XE', image: '🚗', hint: 'Phương tiện đi lại 4 bánh?' },
    { id: 4, word: 'HOA', image: '🌸', hint: 'Cây gì nở rực rỡ?' },
    { id: 5, word: 'BÓNG', image: '⚽', hint: 'Vật tròn để đá?' },
    { id: 6, word: 'MÈO', image: '🐱', hint: 'Con gì kêu meo meo?' },
    { id: 7, word: 'CHÓ', image: '🐕', hint: 'Con gì giữ nhà?' },
    { id: 8, word: 'NHÀ', image: '🏠', hint: 'Nơi gia đình sinh sống?' },
    { id: 9, word: 'ÁO', image: '👕', hint: 'Mặc trên người?' },
    { id: 10, word: 'TÁO', image: '🍎', hint: 'Quả gì màu đỏ?' },
    { id: 11, word: 'LÁ', image: '🍃', hint: 'Mọc trên cành cây?' },
    { id: 12, word: 'SÁCH', image: '📚', hint: 'Để đọc?' },
    { id: 13, word: 'BÚT', image: '✏️', hint: 'Để viết?' },
    { id: 14, word: 'GHẾ', image: '🪑', hint: 'Để ngồi?' }

  ];

  currentLevelIndex = 0;
  currentLevel: WordLevel = this.levels[0];

  // Game State
  userAnswer: (string | null)[] = [];
  shuffledOptions: { char: string, id: number, used: boolean }[] = [];

  isCorrect: boolean = false;
  isWrong: boolean = false;
  showFeedback: boolean = false;
  isFinished: boolean = false;

  constructor(private location: Location, private router: Router, private mascot: MascotService) { }

  ngOnInit(): void {
    this.mascot.setEmotion('happy', 'Chào con! Hãy ghép từ đúng nhé! 📚', 3000);
    this.loadLevel();
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
          this.mascot.setEmotion('celebrating', 'Chúc mừng bé đã hoàn thành tất cả các bài! 🏆', 4000);
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
