import { Component, OnInit, inject } from '@angular/core';
import { MOCK_VIETNAMESE_EXERCISES } from '../../../core/initial-data/vietnamese-exercises.mock';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { KidButtonComponent } from '../../../shared/ui-kit/kid-button/kid-button.component';
import { DailyProgressService } from '../../../core/services/daily-progress.service';
import { ExerciseService } from '../../../core/services/exercise.service';
import { SimpleWordQuestion } from '../../../core/models/exercise.model';
import { LessonTimerComponent } from '../../../shared/components/lesson-timer/lesson-timer.component';
import { LessonTimerService } from '../../../core/services/lesson-timer.service';
import { LearningService } from '../../../core/services/learning.service';

interface WordLevel {
  word: string;
  image: string;
  hint: string;
  syllables: string[];
  distractors: string[];
}

@Component({
  selector: 'app-simple-words',
  standalone: true,
  imports: [CommonModule, KidButtonComponent, LessonTimerComponent],
  templateUrl: './simple-words.component.html',
  styleUrl: './simple-words.component.css'
})
export class SimpleWordsComponent implements OnInit {
  private exerciseService = inject(ExerciseService);
  private location = inject(Location);
  private dailyProgress = inject(DailyProgressService);
  private lessonTimer = inject(LessonTimerService);
  private learningService = inject(LearningService);

  levels: WordLevel[] = [];
  currentLevelIndex = 0;
  currentLevel!: WordLevel;

  // Game State
  usedSyllables: string[] = []; // List of correctly chosen syllables
  shuffledOptions: string[] = []; // Pool of options

  isCorrect: boolean = false;
  isWrong: boolean = false;
  showFeedback: boolean = false;
  isFinished: boolean = false;
  isLoading: boolean = true;
  score: number = 0;
  startTime: number = 0;
  previousFastestTime: number = 0;
  completionDuration: number = 0;

  ngOnInit(): void {
    this.loadPreviousFastestTime();
    this.loadExerciseData();
  }

  ngOnDestroy() {
    this.lessonTimer.stopTimer();
  }

  loadPreviousFastestTime() {
    this.learningService.getCompletionTime('simple-words').subscribe({
      next: (data) => {
        if (data && data.fastestTimeSeconds > 0) {
          this.previousFastestTime = data.fastestTimeSeconds;
        }
      },
      error: () => {
        this.previousFastestTime = 0;
      }
    });
  }

  loadExerciseData() {
    this.isLoading = true;
    console.log('🔍 Loading exercises with filters:', { type: 'simple-words', status: 'published' });

    this.exerciseService.getExercises({ type: 'simple-words', status: 'published' }).subscribe({
      next: (exercises) => {
        console.log('📦 Received exercises:', exercises.length);

        if (exercises.length > 0) {
          console.log('📄 First exercise:', {
            id: exercises[0].id,
            title: exercises[0].title,
            questionCount: exercises[0].questionCount,
            status: exercises[0].status
          });
        }

        // SORT: Newest first to show the latest AI generated content
        exercises.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });

        // Pick the newest one
        let targetExercise = exercises[0];

        if (targetExercise) {
          console.log('✅ Selected NEWEST exercise:', {
            id: targetExercise.id,
            title: targetExercise.title,
            createdAt: targetExercise.createdAt,
            questions: targetExercise.questionCount
          });
        }

        // FALLBACK
        if (!targetExercise) {
          console.warn('⚠️ No exercise found in database, using mock data');
          const mock = MOCK_VIETNAMESE_EXERCISES.find((e: any) => e.type === 'simple-words');
          if (mock) targetExercise = mock as any;
        }

        if (targetExercise && targetExercise.questions && targetExercise.questions.length > 0) {
          const questionsToUse = targetExercise.questions.slice(0, 5); // Take 5
          console.log('✅ Using', questionsToUse.length, 'questions from exercise');

          this.levels = questionsToUse
            .filter((q: any) => q.type === 'simple-words')
            .map((q: any) => {
              const data = q.data as SimpleWordQuestion;
              return {
                word: data.word,
                image: data.iconEmoji || data.imageUrl || '📝', // Prioritize emoji over image URL
                hint: data.meaning,
                syllables: data.syllables && data.syllables.length ? data.syllables : data.word.split(''),
                distractors: data.distractors || []
              };
            });

          if (this.levels.length > 0) {
            this.loadLevel();
          } else {
            console.warn('No valid simple-word questions found.');
          }
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load exercises, using fallback:', err);
        const mock = MOCK_VIETNAMESE_EXERCISES.find((e: any) => e.type === 'simple-words');
        if (mock && mock.questions) {
          const questionsToUse = mock.questions.slice(0, 5);
          this.levels = questionsToUse.map((q: any) => {
            const data = q.data as SimpleWordQuestion;
            return {
              word: data.word,
              image: data.iconEmoji || data.imageUrl || '📝', // Prioritize emoji over image URL
              hint: data.meaning,
              syllables: data.syllables || data.word.split(''),
              distractors: data.distractors || []
            };
          });
          if (this.levels.length > 0) this.loadLevel();
        }
        this.isLoading = false;
      }
    });
  }

  loadLevel() {
    this.currentLevel = this.levels[this.currentLevelIndex];
    this.usedSyllables = [];
    this.isCorrect = false;
    this.isWrong = false;

    // Create options: Syllables + Distractors
    const pool = [...this.currentLevel.syllables, ...this.currentLevel.distractors];
    this.shuffledOptions = pool.sort(() => Math.random() - 0.5);

    if (this.currentLevelIndex === 0) {
      this.startTime = Date.now();
      this.lessonTimer.startTimer('simple-words');
    }
  }

  onOptionSelect(option: string) {
    if (this.isCorrect || this.isFinished) return;

    // Check count needed vs count used
    const needed = this.currentLevel.syllables.filter(s => s === option).length;
    const used = this.usedSyllables.filter(s => s === option).length;

    if (used < needed) {
      // Correct choice
      this.usedSyllables.push(option);
      this.playSound('pop');
      this.checkWin();
    } else {
      // Wrong choice (not needed or already full)
      this.isWrong = true;
      this.playSound('wrong');
      setTimeout(() => this.isWrong = false, 500);
    }
  }

  // Check if a specific syllable instance in the word is filled (used for display highlighting)
  // Since we don't track by index in usedSyllables, we count occurrences.
  // If we have 2 'A' in word, and 1 'A' in usedSyllables -> first 'A' highlighted, second not.
  // We need to know WHICH index this syllable corresponds to in currentLevel.syllables.
  // But standard ngFor just gives syllable. We need index.
  // Method signature needs updating in HTML to pass index if we want precise visual,
  // but here I can use a simpler heuristic for the *ngClass binding:
  // "How many times does this syllable appear in range [0...currentIndex] of syllables list?" -> N
  // "Is count of this syllable in usedSyllables >= N?"
  isSyllableUsed(syllable: string): boolean {
    // This signature is naive if there are duplicates.
    // But for simple visualization, if I just return true if used count > 0, all 'A's might light up.
    // To fix duplicates, I need the index from the loop.
    // For now, I'll rely on a simple check: is it in usedSyllables?
    // This will highlight ALL instances if one is picked -> acceptable for simple games,
    // OR strictly: we need index.

    // Better: `isSyllableUsed(syllable)` returns true if fully filled? No.
    // Let's change this to accept index implicitly or rename.

    // Quick fix: Just check if we have enough collected.
    // But visual feedback requires index.
    // I will update HTML to pass index, but for now I implement a "count based" check?
    // No, I can't know the index here without argument.

    // Let's assume simpler logic: If user picked 'A', and word has 'A', 'A' -> highlight first 'A'.
    // This requires state in Template.

    // Alternative: Just return true if count in usedSyllables > 0?
    // No, if user picked 1 'A', only 1 slot should fill.

    // I will use a helper that I call in template with index.
    // But I can't change signature without changing HTML.
    // HTML calls `isSyllableUsed(syllable)`.
    // I will update HTML in next step to pass index: `isSyllableUsed(syllable, i)`
    return false;
  }

  // Real implementation for template with index
  isSyllableFilled(syllable: string, index: number): boolean {
    // Find how many times this  isSyllableFilled(syllable: string, index: number): boolean {
    const occurrencesUpToHere = this.currentLevel.syllables.slice(0, index + 1).filter(s => s === syllable).length;
    const usedCount = this.usedSyllables.filter(s => s === syllable).length;
    return usedCount >= occurrencesUpToHere;
  }

  isOptionFullyUsed(option: string): boolean {
    const needed = this.currentLevel.syllables.filter(s => s === option).length;
    const used = this.usedSyllables.filter(s => s === option).length;
    return used >= needed;
  }

  checkWin() {
    if (this.usedSyllables.length === this.currentLevel.syllables.length) {
      this.isCorrect = true;
      this.playSound('success');
      this.showFeedback = true;

      setTimeout(() => {
        this.showFeedback = false;
        this.score += 10;
        this.nextLevel();
      }, 2000);
    }
  }

  nextLevel() {
    if (this.currentLevelIndex < this.levels.length - 1) {
      this.currentLevelIndex++;
      this.loadLevel();
    } else {
      this.isFinished = true;
      this.dailyProgress.incrementCompletion('simple-words');

      // Stop timer and save session
      const durationSeconds = this.lessonTimer.stopTimer();
      this.completionDuration = durationSeconds;

      // Save to backend
      this.learningService.completeSession({
        levelId: 'simple-words',
        score: this.score,
        totalQuestions: this.levels.length,
        durationSeconds: durationSeconds
      }).subscribe();
    }
  }

  restartGame() {
    this.currentLevelIndex = 0;
    this.isFinished = false;
    this.score = 0;
    this.loadLevel();
    this.startTime = Date.now();
    this.lessonTimer.startTimer('simple-words');
  }

  readQuestion() {
    if (this.currentLevel) {
      // Cancel any current speech
      window.speechSynthesis.cancel();

      const text = `${this.currentLevel.word}. ${this.currentLevel.hint}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }

  goBack() {
    this.location.back();
  }

  playSound(type: 'pop' | 'click' | 'success' | 'wrong') {
    // Placeholder
  }
}
