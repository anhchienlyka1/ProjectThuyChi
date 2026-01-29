import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ExerciseService } from '../../../../core/services/exercise.service';
import { AIQuestionGeneratorService, AIGenerationParams } from '../../../../core/services/ai-question-generator.service';
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

    // AI Generation parameters
    aiParams: AIGenerationParams = {
        exerciseType: 'simple-words',
        questionCount: 10,
        difficulty: 'easy',
        wordCategory: 'animals',
        syllableCount: 1,
        includeDistractors: true,
        focusArea: 'tones'
    };

    // Generated questions
    generatedQuestions: (SimpleWordQuestion | SpellingQuestion | FillInBlankQuestion)[] = [];

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

    // Suggestion templates for description - Prompt style
    descriptionSuggestions: string[] = [
        'Tạo giúp tôi 10 câu hỏi về từ đơn giản với chủ đề là động vật',
        'Tạo giúp tôi 10 câu hỏi về đánh vần với chủ đề là gia đình',
        'Tạo giúp tôi 10 câu hỏi về từ đơn giản với chủ đề là thiên nhiên',
        'Tạo giúp tôi 10 câu hỏi về đánh vần với chủ đề là trường học',
        'Tạo giúp tôi 10 câu hỏi về từ đơn giản với chủ đề là đồ vật'
    ];

    // Category is locked to vietnamese
    categories: { value: ExerciseCategory; label: string }[] = [
        { value: 'vietnamese', label: 'Tiếng Việt' }
    ];

    constructor(
        private fb: FormBuilder,
        private exerciseService: ExerciseService,
        private aiService: AIQuestionGeneratorService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.initForm();
        this.checkEditMode();
    }

    initForm(): void {
        this.exerciseForm = this.fb.group({
            type: ['simple-words', Validators.required],
            category: ['vietnamese', Validators.required],
            difficulty: ['easy'], // Default, not displayed in UI
            title: [''], // Auto-generated
            description: ['', [Validators.required, Validators.minLength(10)]],
            tags: [''],
            status: ['draft']
        });

        // Generate initial title and description
        this.updateAutoFields();
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
     * Use a suggested description
     */
    useDescription(suggestion: string): void {
        this.exerciseForm.patchValue({ description: suggestion });
        this.exerciseForm.get('description')?.markAsDirty();
    }

    /**
     * Handle type change from dropdown
     */
    onTypeChange(): void {
        const selectedType = this.exerciseForm.value.type as 'simple-words' | 'spelling' | 'fill-in-blank';
        this.aiParams.exerciseType = selectedType;
        this.generatedQuestions = []; // Reset questions when changing type
        this.updateAutoFields(); // Auto-generate title and description
    }

    /**
     * Auto-generate title and description based on exercise type
     */
    updateAutoFields(): void {
        const type = this.exerciseForm.value.type;
        let title = '';
        let description = '';

        // Randomly select a topic for the prompt
        const topics = ['động vật', 'gia đình', 'đồ vật', 'thiên nhiên', 'thức ăn', 'trường học'];
        const randomTopic = topics[Math.floor(Math.random() * topics.length)];

        // Map topic to AI param category roughly (for internal logic)
        const topicMap: Record<string, 'animals' | 'family' | 'objects' | 'nature' | 'food'> = {
            'động vật': 'animals',
            'gia đình': 'family',
            'đồ vật': 'objects',
            'thiên nhiên': 'nature',
            'thức ăn': 'food',
            'trường học': 'objects' // Fallback
        };
        if (topicMap[randomTopic]) {
            this.aiParams.wordCategory = topicMap[randomTopic];
        }

        if (type === 'simple-words') {
            title = 'Bài tập Từ đơn giản - Tiếng Việt';
            description = `Tạo giúp tôi 10 câu hỏi về từ đơn giản với chủ đề là ${randomTopic}`;
        } else if (type === 'spelling') {
            title = 'Bài tập Ghép vần - Tiếng Việt';
            description = `Tạo giúp tôi 10 câu hỏi về ghép vần với chủ đề là ${randomTopic}`;
        } else if (type === 'fill-in-blank') {
            title = 'Bài tập Điền chữ - Tiếng Việt';
            description = `Tạo giúp tôi 10 câu hỏi điền chữ vào chỗ trống với chủ đề là ${randomTopic}`;
        }

        this.exerciseForm.patchValue({
            title,
            description
        }, { emitEvent: false });
    }

    /**
     * Generate questions using AI
     */
    generateQuestionsWithAI(): void {
        this.isGenerating = true;

        // Auto-select a random category to add variety since UI is hidden
        const categories: ('animals' | 'family' | 'objects' | 'nature' | 'food')[] =
            ['animals', 'family', 'objects', 'nature', 'food'];
        this.aiParams.wordCategory = categories[Math.floor(Math.random() * categories.length)];

        // Update AI params from form basics
        this.aiParams.exerciseType = this.exerciseForm.value.type;
        // Default difficulty is easy
        this.aiParams.difficulty = 'easy';

        // Randomize other params slightly for variety
        if (this.aiParams.exerciseType === 'simple-words') {
            this.aiParams.syllableCount = Math.random() > 0.5 ? 1 : 2;
        }

        this.aiService.generateQuestions({
            exerciseType: this.aiParams.exerciseType,
            parameters: this.aiParams
        }).subscribe({
            next: (questions) => {
                this.generatedQuestions = questions as (SimpleWordQuestion | SpellingQuestion | FillInBlankQuestion)[];
                this.isGenerating = false;
                alert(`✅ Đã tạo ${questions.length} câu hỏi thành công!`);
            },
            error: (error) => {
                console.error('Error generating questions:', error);
                this.isGenerating = false;
                alert('❌ Có lỗi xảy ra khi tạo câu hỏi');
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
