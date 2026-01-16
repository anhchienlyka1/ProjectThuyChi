# Auto-Integration Script for Lesson Timer

## Components cần tích hợp Timer

### Math Modules

- [x] addition ✅ (Đã tích hợp)
- [ ] subtraction
- [ ] comparison  
- [ ] sorting
- [ ] fill-in-blank

### Vietnamese Modules

- [x] spelling ✅ (Đã tích hợp)
- [ ] alphabet
- [ ] simple-words

### Games

- [ ] treasure-hunt
- [ ] tug-of-war

## Checklist cho mỗi component

### TypeScript (.ts)

1. Import dependencies:

   ```typescript
   import { OnDestroy } from '@angular/core';
   import { LessonTimerService } from '../../../core/services/lesson-timer.service';
   import { LessonTimerComponent } from '../../../shared/components/lesson-timer/lesson-timer.component';
   import { LessonCompletionStatsComponent } from '../../../shared/components/lesson-completion-stats/lesson-completion-stats.component';
   import { LearningService } from '../../../core/services/learning.service';
   ```

2. Add to imports array:

   ```typescript
   imports: [..., LessonTimerComponent, LessonCompletionStatsComponent]
   ```

3. Implement OnDestroy:

   ```typescript
   export class YourComponent implements OnInit, OnDestroy
   ```

4. Inject services:

   ```typescript
   private lessonTimer = inject(LessonTimerService);
   private learningService = inject(LearningService);
   ```

5. Add state properties:

   ```typescript
   showCompletionStats = false;
   completionDuration = 0;
   ```

6. Start timer in game start:

   ```typescript
   this.lessonTimer.startTimer('level-id');
   ```

7. Stop timer and save in finish:

   ```typescript
   const durationSeconds = this.lessonTimer.stopTimer();
   this.completionDuration = durationSeconds;
   
   this.learningService.completeSession({
     levelId: 'level-id',
     score: this.score,
     totalQuestions: this.totalQuestions,
     durationSeconds: durationSeconds
   }).subscribe({
     next: (response) => {
       setTimeout(() => {
         this.showCompletionStats = true;
       }, 2000);
     }
   });
   ```

8. Add ngOnDestroy:

   ```typescript
   ngOnDestroy() {
     this.lessonTimer.stopTimer();
   }
   ```

9. Add close method:

   ```typescript
   closeCompletionStats() {
     this.showCompletionStats = false;
   }
   ```

### HTML Template

1. Add timer to header:

   ```html
   <app-lesson-timer [compact]="true"></app-lesson-timer>
   ```

2. Add stats modal at end:

   ```html
   <app-lesson-completion-stats 
       *ngIf="showCompletionStats" 
       [levelId]="'level-id'" 
       [currentDuration]="completionDuration"
       (close)="closeCompletionStats()">
   </app-lesson-completion-stats>
   ```

## Level IDs

- addition: 'addition'
- subtraction: 'subtraction'
- comparison: 'comparison'
- sorting: 'sorting'
- fill-in-blank: 'fill-in-blank'
- spelling: 'spelling'
- alphabet: 'alphabet'
- simple-words: 'simple-words'
- treasure-hunt: 'treasure-hunt'
- tug-of-war: 'tug-of-war'

## Completed

✅ Addition Component
✅ Spelling Component

## Next Steps

1. Subtraction
2. Comparison
3. Sorting
4. Fill-in-blank
5. Alphabet
6. Simple-words
7. Treasure-hunt
8. Tug-of-war
