import { Component, inject, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { KidButtonComponent } from '../../../shared/ui-kit/kid-button/kid-button.component';
import { MascotService } from '../../../core/services/mascot.service';
import { AudioService } from '../../../core/services/audio.service';
import { LearningService } from '../../../core/services/learning.service';
import { DailyProgressService } from '../../../core/services/daily-progress.service';
import { CertificatePopupComponent } from '../../../shared/components/certificate-popup.component';
import { LessonTimerService } from '../../../core/services/lesson-timer.service';
import { LessonTimerComponent } from '../../../shared/components/lesson-timer/lesson-timer.component';
import { LessonCompletionStatsComponent } from '../../../shared/components/lesson-completion-stats/lesson-completion-stats.component';

interface Shape {
    id: number;
    type: 'circle' | 'square' | 'triangle' | 'rectangle' | 'star' | 'diamond';
    color: string;
    colorHex: string;
    colorName: string;
    typeName: string;
    questionName: string; // e.g., "Hình tròn màu đỏ"
}

@Component({
    selector: 'app-geometry',
    standalone: true,
    imports: [CommonModule, KidButtonComponent, CertificatePopupComponent, LessonTimerComponent, LessonCompletionStatsComponent],
    templateUrl: './geometry.component.html',
    styles: [`
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    .animate-float { animation: float 3s ease-in-out infinite; }

    @keyframes pop-in {
      0% { transform: scale(0); opacity: 0; }
      80% { transform: scale(1.1); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
    .animate-pop-in { animation: pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

    @keyframes bounce-in {
      0% { transform: scale(0.3); opacity: 0; }
      50% { transform: scale(1.05); }
      70% { transform: scale(0.9); }
      100% { transform: scale(1); opacity: 1; }
    }
    .animate-bounce-in { animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; }
  `]
})
export class GeometryComponent implements OnInit, OnDestroy {
    private router = inject(Router);
    private mascot = inject(MascotService);
    private audioService = inject(AudioService);
    private learningService = inject(LearningService);
    private dailyProgress = inject(DailyProgressService);
    private lessonTimer = inject(LessonTimerService);

    totalQuestions = 10;
    currentQuestionIndex = 0;
    correctCount = 0;
    wrongCount = 0;
    score = 0;

    isFinished = false;
    showFeedback = false;
    isCorrect = false;
    hasErrorInCurrentRound = false;

    // Achievement & Stats
    showAchievement = false;
    earnedAchievement: any = null;
    showCompletionStats = false;
    completionDuration = 0;
    previousFastestTime = 0;

    // Game Data
    currentQuestion: string = '';
    targetShape: Shape | null = null;
    options: Shape[] = [];

    // Shape Definitions
    @ViewChild('shapeCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

    gameMode: 'identification' | 'counting' = 'identification';

    // Counting Game Data
    countingOptions: number[] = [];
    correctCountAnswer: number = 0;

    // Shape Definitions
    availableShapes = [
        { type: 'circle', name: 'Hình tròn' },
        { type: 'square', name: 'Hình vuông' },
        { type: 'triangle', name: 'Hình tam giác' },
        { type: 'rectangle', name: 'Hình chữ nhật' },
        { type: 'star', name: 'Hình ngôi sao' },
        { type: 'diamond', name: 'Hình thoi' }
    ];

    colors = [
        { name: 'Đỏ', hex: '#EF4444', class: 'text-red-500' },
        { name: 'Xanh dương', hex: '#3B82F6', class: 'text-blue-500' },
        { name: 'Xanh lá', hex: '#22C55E', class: 'text-green-500' },
        { name: 'Vàng', hex: '#EAB308', class: 'text-yellow-500' },
        { name: 'Cam', hex: '#F97316', class: 'text-orange-500' },
        { name: 'Tím', hex: '#A855F7', class: 'text-purple-500' }
    ];

    ngOnInit() {
        this.loadPreviousFastestTime();
        this.mascot.setEmotion('happy', 'Chào mừng bé đến với bài học Hình Học! 📐', 3000);
        this.startGame();
    }

    ngOnDestroy() {
        this.lessonTimer.stopTimer();
    }

    loadPreviousFastestTime() {
        this.learningService.getCompletionTime('geometry').subscribe({
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

    startGame() {
        this.currentQuestionIndex = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.score = 0;
        this.isFinished = false;
        this.hasErrorInCurrentRound = false;

        this.lessonTimer.startTimer('geometry');
        this.generateNewRound();
    }

    generateNewRound() {
        this.currentQuestionIndex++;
        this.hasErrorInCurrentRound = false;

        // Randomly select game mode (50/50)
        this.gameMode = Math.random() > 0.5 ? 'identification' : 'counting';

        if (this.gameMode === 'identification') {
            this.setupIdentificationGame();
        } else {
            // Need a slight delay for ViewChild to be available if switching views
            setTimeout(() => {
                this.setupCountingGame();
            }, 100);
        }
    }

    setupIdentificationGame() {
        // Pick 3 random shapes for options
        this.options = [];
        const numOptions = 3;

        // Create random unique options
        while (this.options.length < numOptions) {
            const shapeType = this.availableShapes[Math.floor(Math.random() * this.availableShapes.length)];
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];

            const newShape: Shape = {
                id: Math.random(),
                type: shapeType.type as any,
                typeName: shapeType.name,
                color: color.class,
                colorHex: color.hex,
                colorName: color.name,
                questionName: `${shapeType.name} màu ${color.name}`
            };

            // Ensure no duplicates
            const isDuplicate = this.options.some(opt =>
                opt.type === newShape.type && opt.colorName === newShape.colorName
            );

            if (!isDuplicate) {
                this.options.push(newShape);
            }
        }

        // Pick a target
        this.targetShape = this.options[Math.floor(Math.random() * this.options.length)];
        this.currentQuestion = `Bé hãy tìm ${this.targetShape.questionName} nhé!`;

        // Mascot prompt
        this.mascot.setEmotion('thinking', this.currentQuestion, 4000);
        this.readQuestion();
    }

    setupCountingGame() {
        if (!this.canvasRef) return;
        const canvas = this.canvasRef.nativeElement;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Decide: Nested (30%) or Scattered (70%)
        const isNested = Math.random() < 0.3;

        let targetShapeType: any;
        let count = 0;

        if (isNested) {
            // Nested Logic: Draw 3-5 shapes centered and getting smaller
            const numShapes = Math.floor(Math.random() * 3) + 3; // 3 to 5
            targetShapeType = this.availableShapes[Math.floor(Math.random() * this.availableShapes.length)];

            // Draw shapes from big to small
            let size = 200;
            const step = 40;
            count = 0; // Count ONLY the target shape type

            for (let i = 0; i < numShapes; i++) {
                // Randomize shape type for each layer, but ensure target type appears at least once
                let currentTypeIndex = Math.floor(Math.random() * this.availableShapes.length);
                let currentType = this.availableShapes[currentTypeIndex];

                // Force at least one target shape
                if (i === 0 || count === 0 && i === numShapes - 1) {
                    currentType = targetShapeType;
                }

                if (currentType.type === targetShapeType.type) count++;

                const color = this.colors[Math.floor(Math.random() * this.colors.length)];

                this.drawShape(ctx, currentType.type, canvas.width / 2, canvas.height / 2, size, color.hex);
                size -= step;
            }
        } else {
            // Scattered Logic
            targetShapeType = this.availableShapes[Math.floor(Math.random() * this.availableShapes.length)];
            const totalShapesToDraw = Math.floor(Math.random() * 5) + 4; // 4 to 8 shapes

            count = 0;

            for (let i = 0; i < totalShapesToDraw; i++) {
                // Determine if this shape is the target type
                // Ensure reasonable probability so count isn't always 0 or 1
                const isTarget = Math.random() < 0.4;
                const shapeType = isTarget ? targetShapeType : this.availableShapes[Math.floor(Math.random() * this.availableShapes.length)];

                if (shapeType.type === targetShapeType.type) count++;

                const color = this.colors[Math.floor(Math.random() * this.colors.length)];

                // Random pos with padding
                const x = 50 + Math.random() * (canvas.width - 100);
                const y = 50 + Math.random() * (canvas.height - 100);
                const size = 30 + Math.random() * 40; // 30-70 radius

                this.drawShape(ctx, shapeType.type, x, y, size, color.hex);
            }

            // If count is 0 (bad luck), force add one
            if (count === 0) {
                const x = 50 + Math.random() * (canvas.width - 100);
                const y = 50 + Math.random() * (canvas.height - 100);
                this.drawShape(ctx, targetShapeType.type, x, y, 50, this.colors[0].hex);
                count = 1;
            }
        }

        this.correctCountAnswer = count;
        this.currentQuestion = `Có bao nhiêu **${targetShapeType.name}** trong hình?`;

        // Generate Options
        this.countingOptions = [count];
        while (this.countingOptions.length < 4) {
            const wrong = Math.max(1, count + Math.floor(Math.random() * 5) - 2);
            if (!this.countingOptions.includes(wrong)) {
                this.countingOptions.push(wrong);
            }
        }
        this.countingOptions.sort(() => Math.random() - 0.5);

        this.mascot.setEmotion('thinking', this.currentQuestion, 4000);
        this.audioService.speak(this.currentQuestion.replace(/\*\*/g, ''));
    }

    drawShape(ctx: CanvasRenderingContext2D, type: string, x: number, y: number, r: number, color: string) {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;

        switch (type) {
            case 'circle':
                ctx.arc(x, y, r, 0, Math.PI * 2);
                break;
            case 'square':
                ctx.rect(x - r, y - r, r * 2, r * 2);
                break;
            case 'rectangle':
                ctx.rect(x - r, y - r * 0.6, r * 2, r * 1.2);
                break;
            case 'triangle':
                ctx.moveTo(x, y - r);
                ctx.lineTo(x + r, y + r);
                ctx.lineTo(x - r, y + r);
                ctx.closePath();
                break;
            case 'diamond':
                ctx.moveTo(x, y - r);
                ctx.lineTo(x + r, y);
                ctx.lineTo(x, y + r);
                ctx.lineTo(x - r, y);
                ctx.closePath();
                break;
            case 'star':
                for (let i = 0; i < 5; i++) {
                    ctx.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * r + x,
                        -Math.sin((18 + i * 72) / 180 * Math.PI) * r + y);
                    ctx.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * r * 0.5 + x,
                        -Math.sin((54 + i * 72) / 180 * Math.PI) * r * 0.5 + y);
                }
                ctx.closePath();
                break;
        }

        ctx.globalAlpha = 0.9; // Slight transparency for overlap visibility
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.stroke();
    }

    readQuestion() {
        if (this.gameMode === 'identification') {
            if (this.targetShape) {
                this.audioService.speak(this.currentQuestion);
            }
        } else {
            this.audioService.speak(this.currentQuestion.replace(/\*\*/g, ''));
        }
    }

    checkAnswer(selected: any) {
        if (this.showFeedback) return;

        let isCorrect = false;

        if (this.gameMode === 'identification') {
            isCorrect = (selected as Shape) === this.targetShape;
        } else {
            isCorrect = (selected as number) === this.correctCountAnswer;
        }

        this.isCorrect = isCorrect;

        if (isCorrect) {
            if (!this.hasErrorInCurrentRound) {
                this.score += 10;
                this.correctCount++;
            }
            this.mascot.celebrate();
            this.audioService.playCorrectSound();
        } else {
            if (!this.hasErrorInCurrentRound) {
                this.wrongCount++;
            }
            this.hasErrorInCurrentRound = true;
            this.mascot.setEmotion('sad', 'Chưa đúng rồi, bé thử lại nhé!', 2000);
            this.audioService.playWrongSound();
        }

        this.showFeedback = true;

        setTimeout(() => {
            this.showFeedback = false;
            // For counting game, we don't need to "remove" the wrong answer visually, just let them pick again
            // For identification game, same.

            if (this.isCorrect) {
                if (this.currentQuestionIndex < this.totalQuestions) {
                    this.generateNewRound();
                } else {
                    this.finishGame();
                }
            }
        }, 2000);
    }

    finishGame() {
        const durationSeconds = this.lessonTimer.stopTimer();
        this.completionDuration = durationSeconds;
        const isNewRecord = this.previousFastestTime === 0 || durationSeconds < this.previousFastestTime;

        this.dailyProgress.incrementCompletion('geometry');
        this.learningService.completeSession({
            levelId: 'geometry',
            score: this.score,
            totalQuestions: this.totalQuestions,
            durationSeconds: durationSeconds
        }).subscribe({
            next: (response) => {
                const completionCount = this.dailyProgress.getTodayCompletionCount('geometry');
                const starMessage = response.starsEarned > 0
                    ? `Bé đạt ${response.starsEarned} sao! Đã hoàn thành ${completionCount} lần hôm nay! 🔥`
                    : `Bé hãy cố gắng hơn lần sau nhé!`;
                this.mascot.setEmotion('celebrating', starMessage, 5000);

                if (response.improvementAchievement) {
                    this.earnedAchievement = { ...response.improvementAchievement, date: new Date().toLocaleDateString('vi-VN') };
                    setTimeout(() => { this.showAchievement = true; }, 300);
                } else if (response.achievement) {
                    this.earnedAchievement = { ...response.achievement, date: new Date().toLocaleDateString('vi-VN') };
                    setTimeout(() => { this.showAchievement = true; }, 300);
                } else {
                    this.isFinished = true;
                    if (isNewRecord) {
                        setTimeout(() => { this.showCompletionStats = true; }, 1500);
                    }
                }
            },
            error: () => {
                this.isFinished = true;
                if (isNewRecord) {
                    setTimeout(() => { this.showCompletionStats = true; }, 1500);
                }
            }
        });
    }

    closeAchievement() {
        this.showAchievement = false;
        this.isFinished = true;
        const isNewRecord = this.previousFastestTime === 0 || this.completionDuration < this.previousFastestTime;
        if (isNewRecord) {
            setTimeout(() => { this.showCompletionStats = true; }, 300);
        }
    }

    closeCompletionStats() {
        this.showCompletionStats = false;
    }

    goBack() {
        this.router.navigate(['/math']);
    }

    formatDuration(seconds: number): string {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}
