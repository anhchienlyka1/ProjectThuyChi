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
  ExerciseStatus,
  Question,
  SimpleWordQuestion,
  SpellingQuestion,
  FillInBlankQuestion,
  AlphabetQuestion,
  SentenceBuilderQuestion
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
    { value: 'alphabet', label: 'Bảng Chữ Cái', icon: '🔤' },
    { value: 'simple-words', label: 'Ghép Từ Đơn', icon: '📖' },
    { value: 'fill-in-blank', label: 'Điền Chữ', icon: '✏️' },
    { value: 'spelling', label: 'Ghép Vần', icon: '🎯' },
    { value: 'sentence-builder', label: 'Xếp Từ Thành Câu', icon: '🧩' }
  ];

  // Difficulty is locked to easy
  difficulties: { value: ExerciseDifficulty; label: string; class: string }[] = [];

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
    this.updateTitle();
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
      status: ['published' as ExerciseStatus]
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
    } else if (type === 'alphabet') {
      title = 'Bài tập Bảng Chữ Cái';
    } else if (type === 'sentence-builder') {
      title = topic ? `Bài tập Xếp Câu: ${topic}` : 'Bài tập Xếp Câu';
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

  // Modal State
  showResultModal = false;
  modalMessage = '';
  modalType: 'success' | 'error' | 'warning' = 'success';

  /**
   * Show Modal Helper
   */
  showModal(message: string, type: 'success' | 'error' | 'warning' = 'success'): void {
    this.modalMessage = message;
    this.modalType = type;
    this.showResultModal = true;
  }

  closeModal(): void {
    this.showResultModal = false;
    // If it was a success message from submit, navigate away
    if (this.modalType === 'success' && this.modalMessage.includes('thành công') && (this.modalMessage.includes('Cập nhật') || this.modalMessage.includes('Tạo và'))) {
      this.router.navigate(['/admin/exercises']);
    }
  }

  /**
   * Generate questions using AI (Gemini)
   */
  generateQuestionsWithAI(): void {
    const formValue = this.exerciseForm.value;

    if (!formValue.topic) {
      this.showModal('⚠️ Vui lòng nhập chủ đề!', 'warning'); return;
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
        this.showModal(`✅ Đã tạo ${this.generatedQuestions.length} câu hỏi thành công!`, 'success');
      },
      error: (error: any) => {
        console.error('Error generating questions:', error);
        this.isGenerating = false;
        this.showModal('❌ Có lỗi xảy ra khi tạo câu hỏi. Vui lòng thử lại.', 'error');
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
   * Helper to check if question is SentenceBuilderQuestion
   */
  isSentenceBuilderQuestion(question: any): question is SentenceBuilderQuestion {
    return 'sentence' in question && 'hint' in question && 'words' in question;
  }

  /**
   * Helper to check if question is AlphabetQuestion
   */
  isAlphabetQuestion(question: any): question is AlphabetQuestion {
    return 'letter' in question && 'pronunciation' in question;
  }


  /**
   * Submit form (create or update exercise)
   */
  async onSubmit(): Promise<void> {
    if (this.exerciseForm.invalid) {
      this.exerciseForm.markAllAsTouched();
      this.showModal('⚠️ Vui lòng điền đầy đủ thông tin!', 'warning');
      return;
    }

    if (this.generatedQuestions.length === 0) {
      this.showModal('Vui lòng tạo ít nhất một câu hỏi trước khi lưu!', 'warning');
      return;
    }

    this.isSaving = true;
    const formValue = this.exerciseForm.value;

    // Convert generated questions to Question format
    const questions: Question[] = this.generatedQuestions.map(q => {
      const exerciseType = formValue.type;

      // Type-safe conversion based on exercise type
      if (exerciseType === 'simple-words' && this.isSimpleWordQuestion(q)) {
        return { type: 'simple-words' as const, data: q };
      } else if (exerciseType === 'spelling' && this.isSpellingQuestion(q)) {
        return { type: 'spelling' as const, data: q };
      } else if (exerciseType === 'fill-in-blank' && this.isFillInBlankQuestion(q)) {
        return { type: 'fill-in-blank' as const, data: q };
      } else if (exerciseType === 'alphabet' && this.isAlphabetQuestion(q)) {
        return { type: 'alphabet' as const, data: q };
      } else if (exerciseType === 'sentence-builder' && this.isSentenceBuilderQuestion(q)) {
        return { type: 'sentence-builder' as const, data: q };
      } else {
        // Fallback: use form type as-is
        console.warn('Question type mismatch, using form type:', exerciseType);
        return { type: exerciseType, data: q } as Question;
      }
    });

    const exerciseData: any = {
      type: formValue.type,
      category: formValue.category,
      difficulty: formValue.difficulty,
      title: formValue.title || '',
      description: formValue.description || '', // Firestore doesn't accept undefined
      questionCount: this.generatedQuestions.length,
      questions,
      tags: formValue.tags ? formValue.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t) : [],
      status: 'published' as ExerciseStatus // Force published status
    };

    // Remove undefined fields to prevent Firestore errors
    Object.keys(exerciseData).forEach(key => {
      if (exerciseData[key] === undefined) {
        delete exerciseData[key];
      }
    });

    try {
      // Debug: Log exercise data being saved
      console.log('📝 Exercise data to save:', {
        type: exerciseData.type,
        status: exerciseData.status,
        questionCount: exerciseData.questionCount,
        questions: exerciseData.questions.map((q: any) => ({
          type: q.type,
          hasData: !!q.data
        }))
      });

      // If publishing, archive other exercises of this type first
      if (exerciseData.status === 'published') {
        console.log('🗄️ Archiving old exercises of type:', exerciseData.type);
        await this.exerciseService.archiveOldPublishedExercises(exerciseData.type, this.exerciseId || undefined);
      }

      if (this.isEditMode && this.exerciseId) {
        console.log('✏️ Updating exercise:', this.exerciseId);
        await this.exerciseService.updateExercise(this.exerciseId, exerciseData).toPromise();
        this.showModal('✅ Cập nhật bài tập thành công!', 'success');
      } else {
        console.log('➕ Creating new exercise');
        const newId = await this.exerciseService.createExercise(exerciseData).toPromise();
        console.log('✅ Created exercise with ID:', newId);
        this.showModal('✅ Tạo và xuất bản bài tập thành công!', 'success');
      }
      // Navigate is handled in closeModal
    } catch (error: any) {
      console.error('Error saving exercise:', error);
      // Show more specific error details
      const errorMessage = error?.message || 'Có lỗi xảy ra khi lưu bài tập';
      this.showModal(`❌ Lỗi: ${errorMessage}`, 'error');
    } finally {
      this.isSaving = false;
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
