import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ExerciseService } from '../../../../core/services/exercise.service';
import { AiExerciseGeneratorService, AIGenerationRequest } from '../../../../core/services/ai-exercise-generator.service';
import {
    Exercise,
    ExerciseType,
    ExerciseDifficulty,
    ExerciseCategory,
    Question,
    SimpleWordQuestion,
    SpellingQuestion,
    FillInBlankQuestion
} from '../../../../core/models/exercise.model';

@Component({
    selector: 'app-exercise-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './exercise-form.component.html',
    styleUrls: ['./exercise-form.component.css']
})
export class ExerciseFormComponent implements OnInit {
    exerciseForm!: FormGroup;
    isEditMode = false;
    exerciseId: string | null = null;
    isLoading = false;
    isSaving = false;
    isGenerating = false;

    // Generated questions
    generatedQuestions: (SimpleWordQuestion | SpellingQuestion | FillInBlankQuestion)[] = [];

    // Suggested topics (dynamic based on exercise type)
    suggestedTopics: string[] = [];

    // Exercise type options - Vietnamese only
    exerciseTypes: { value: ExerciseType; label: string; icon: string }[] = [
        { value: 'simple-words', label: 'Từ Đơn', icon: '📝' },
        { value: 'spelling', label: 'Ghép Vần', icon: '✏️' },
        { value: 'fill-in-blank', label: 'Điền Chữ', icon: '🧩' }
    ];

    difficulties: { value: ExerciseDifficulty; label: string; class: string }[] = [
        { value: 'easy', label: 'Dễ', class: 'bg-green-500 hover:bg-green-600' },
        { value: 'medium', label: 'Trung bình', class: 'bg-yellow-500 hover:bg-yellow-600' },
        { value: 'hard', label: 'Khó', class: 'bg-red-500 hover:bg-red-600' }
    ];

    // Category is locked to vietnamese
    categories: { value: ExerciseCategory; label: string }[] = [
        { value: 'vietnamese', label: 'Tiếng Việt' }
    ];

    constructor(
        private fb: FormBuilder,
        private exerciseService: ExerciseService,
        private aiService: AiExerciseGeneratorService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.initForm();
        this.checkEditMode();
        this.updateSuggestedTopics();
    }

    initForm(): void {
        this.exerciseForm = this.fb.group({
            type: ['simple-words', Validators.required],
            category: ['vietnamese', Validators.required],
            difficulty: ['easy', Validators.required],
            topic: ['', Validators.required],
            questionCount: [5, [Validators.required, Validators.min(3), Validators.max(10)]],
            title: [''],
            tags: [''],
            status: ['draft']
        });

        // Listen to type changes
        this.exerciseForm.get('type')?.valueChanges.subscribe(() => {
            this.onTypeChange();
        });

        // Listen to topic changes to update title
        this.exerciseForm.get('topic')?.valueChanges.subscribe(() => {
            this.updateTitle();
        });
    }

    checkEditMode(): void {
        this.exerciseId = this.route.snapshot.paramMap.get('id');
        if (this.exerciseId) {
            this.isEditMode = true;
            this.loadExercise(this.exerciseId);
        }
    }

    loadExercise(id: string): void {
        this.isLoading = true;
        this.exerciseService.getExerciseById(id).subscribe({
            next: (exercise) => {
                if (exercise) {
                    this.exerciseForm.patchValue({
                        type: exercise.type,
                        category: exercise.category,
                        difficulty: exercise.difficulty || 'easy',
                        title: exercise.title,
                        description: exercise.description,
                        tags: exercise.tags.join(', '),
                        status: exercise.status
                    });
                    // TODO: Load generated questions if editing
                }
                this.isLoading = false;
            },
            error: (error: unknown) => {
                console.error('Error loading exercise:', error);
                this.isLoading = false;
            }
        });
    }

    /**
     * Update suggested topics based on exercise type
     */
    updateSuggestedTopics(): void {
        const type = this.exerciseForm.get('type')?.value;
        this.suggestedTopics = this.aiService.suggestTopics(type);
    }

    /**
     * Auto-generate title based on exercise type and topic
     */
    updateTitle(): void {
        const type = this.exerciseForm.get('type')?.value;
        const topic = this.exerciseForm.get('topic')?.value;

        let title = '';

        if (type === 'simple-words') {
            title = topic ? `Bài tập Từ Đơn: ${topic}` : 'Bài tập Từ Đơn';
        } else if (type === 'spelling') {
            title = topic ? `Bài tập Ghép Vần: ${topic}` : 'Bài tập Ghép Vần';
        } else if (type === 'fill-in-blank') {
            title = topic ? `Bài tập Điền Chữ: ${topic}` : 'Bài tập Điền Chữ';
        }

        this.exerciseForm.patchValue({ title }, { emitEvent: false });
    }

    /**
     * Select a suggested topic
     */
    selectTopic(topic: string): void {
        this.exerciseForm.patchValue({ topic });
        this.updateTitle(); // Update title when topic is selected
    }

    /**
     * Handle type change from dropdown
     */
    onTypeChange(): void {
        this.generatedQuestions = [];
        this.updateSuggestedTopics();
        this.exerciseForm.patchValue({ topic: '' });
        this.updateTitle(); // Update title when type changes
    }

    /**
     * Generate questions using AI (Gemini)
     */
    generateQuestionsWithAI(): void {
        const formValue = this.exerciseForm.value;

        if (!formValue.topic) {
            alert('⚠️ Vui lòng nhập chủ đề!'); return;
        }

        this.isGenerating = true;

        const request: AIGenerationRequest = {
            exerciseType: formValue.type,
            topic: formValue.topic,
            questionCount: formValue.questionCount || 5,
            difficulty: formValue.difficulty
        };

        this.aiService.generateExercise(request).subscribe({
            next: (exercise) => {
                if (exercise.questions) {
                    this.generatedQuestions = exercise.questions.map(q => q.data) as any[];

                    if (!formValue.title && exercise.title) {
                        this.exerciseForm.patchValue({ title: exercise.title });
                    }

                    if (exercise.tags && exercise.tags.length > 0) {
                        this.exerciseForm.patchValue({ tags: exercise.tags.join(', ') });
                    }
                }

                this.isGenerating = false;
                alert(`✅ Đã tạo ${this.generatedQuestions.length} câu hỏi thành công!`);
            },
            error: (error: any) => {
                console.error('Error generating questions:', error);
                this.isGenerating = false;
                alert('❌ Có lỗi xảy ra khi tạo câu hỏi. Vui lòng thử lại.');
            }
        });
    }

    /**
     * Delete a question from the list
     */
    deleteQuestion(index: number): void {
        if (confirm('Bạn có chắc muốn xóa câu hỏi này?')) {
            this.generatedQuestions.splice(index, 1);
        }
    }

    /**
     * Helper to check if question is SimpleWordQuestion
     */
    isSimpleWordQuestion(question: any): question is SimpleWordQuestion {
        return 'syllables' in question;
    }

    /**
     * Helper to check if question is SpellingQuestion
     */
    isSpellingQuestion(question: any): question is SpellingQuestion {
        return 'parts' in question;
    }

    /**
     * Helper to check if question is FillInBlankQuestion
     */
    isFillInBlankQuestion(question: any): question is FillInBlankQuestion {
        return 'phrase' in question && 'fullText' in question;
    }

    /**
     * Save as draft
     */
    saveDraft(): void {
        this.exerciseForm.patchValue({ status: 'draft' });
        this.onSubmit();
    }

    /**
     * Submit form (create or update exercise)
     */
    onSubmit(): void {
        if (this.exerciseForm.invalid) {
            this.exerciseForm.markAllAsTouched();
            alert('⚠️ Vui lòng điền đầy đủ thông tin!');
            return;
        }

        if (this.generatedQuestions.length === 0) {
            alert('Vui lòng tạo ít nhất một câu hỏi trước khi lưu!');
            return;
        }

        this.isSaving = true;
        const formValue = this.exerciseForm.value;

        // Convert generated questions to Question format
        const questions: Question[] = this.generatedQuestions.map(q => {
            if (this.isSimpleWordQuestion(q)) {
                return { type: 'simple-words' as const, data: q };
            } else if (this.isSpellingQuestion(q)) {
                return { type: 'spelling' as const, data: q };
            } else {
                return { type: 'fill-in-blank' as const, data: q as FillInBlankQuestion };
            }
        });

        const exerciseData = {
            type: formValue.type,
            category: formValue.category,
            difficulty: formValue.difficulty,
            title: formValue.title,
            description: formValue.description,
            questionCount: this.generatedQuestions.length,
            questions,
            tags: formValue.tags ? formValue.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t) : [],
            status: formValue.status
        };

        if (this.isEditMode && this.exerciseId) {
            this.exerciseService.updateExercise(this.exerciseId, exerciseData).subscribe({
                next: () => {
                    this.isSaving = false;
                    alert('✅ Cập nhật bài tập thành công!');
                    this.router.navigate(['/admin/exercises']);
                },
                error: (error: unknown) => {
                    console.error('Error updating exercise:', error);
                    this.isSaving = false;
                    alert('❌ Có lỗi xảy ra khi cập nhật bài tập');
                }
            });
        } else {
            this.exerciseService.createExercise(exerciseData).subscribe({
                next: () => {
                    this.isSaving = false;
                    alert('✅ Tạo bài tập thành công!');
                    this.router.navigate(['/admin/exercises']);
                },
                error: (error: unknown) => {
                    console.error('Error creating exercise:', error);
                    this.isSaving = false;
                    alert('❌ Có lỗi xảy ra khi tạo bài tập');
                }
            });
        }
    }

    /**
     * Cancel and go back
     */
    cancel(): void {
        if (this.generatedQuestions.length > 0) {
            if (confirm('Bạn có thay đổi chưa lưu. Bạn có chắc muốn hủy?')) {
                this.router.navigate(['/admin/exercises']);
            }
        } else {
            this.router.navigate(['/admin/exercises']);
        }
    }
}
