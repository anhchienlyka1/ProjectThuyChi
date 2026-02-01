import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExerciseService } from '../../../core/services/exercise.service';
import { Exercise, ExerciseFilters, ExerciseType, ExerciseDifficulty, ExerciseStatus } from '../../../core/models/exercise.model';
import { KidButtonComponent } from '../../../shared/ui-kit/kid-button/kid-button.component';
import { IconsModule } from '../../../shared/ui-kit/icons/icons.module';

@Component({
    selector: 'app-exercise-manager',
    standalone: true,
    imports: [CommonModule, FormsModule, KidButtonComponent, IconsModule],
    templateUrl: './exercise-manager.component.html',
    styleUrls: ['./exercise-manager.component.css']
})
export class ExerciseManagerComponent implements OnInit {
    // Expose Math for template use
    Math = Math;

    exercises: Exercise[] = [];
    filteredExercises: Exercise[] = [];
    isLoading = false;

    // Filters
    searchQuery = '';
    selectedType: ExerciseType | 'all' = 'all';
    selectedDifficulty: ExerciseDifficulty | 'all' = 'all';


    // Pagination
    currentPage = 1;
    itemsPerPage = 10;
    totalPages = 1;

    // View mode
    viewMode: 'table' | 'grid' = 'table';

    constructor(
        private exerciseService: ExerciseService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadExercises();
    }

    loadExercises(): void {
        this.isLoading = true;
        const filters: ExerciseFilters = {
            category: 'vietnamese' // Only show Vietnamese exercises
        };

        if (this.selectedType !== 'all') {
            filters.type = this.selectedType;
        }
        if (this.selectedDifficulty !== 'all') {
            filters.difficulty = this.selectedDifficulty;
        }

        if (this.searchQuery) {
            filters.searchQuery = this.searchQuery;
        }

        this.exerciseService.getExercises(filters).subscribe({
            next: (exercises) => {
                this.exercises = exercises;
                this.filteredExercises = exercises;
                this.totalPages = Math.ceil(exercises.length / this.itemsPerPage);
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading exercises:', error);
                this.isLoading = false;
            }
        });
    }

    get paginatedExercises(): Exercise[] {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.filteredExercises.slice(start, end);
    }

    onSearchChange(): void {
        this.currentPage = 1;
        this.loadExercises();
    }

    onFilterChange(): void {
        this.currentPage = 1;
        this.loadExercises();
    }

    navigateToCreate(): void {
        this.router.navigate(['/admin/exercises/new']);
    }

    navigateToEdit(id: string): void {
        this.router.navigate(['/admin/exercises', id, 'edit']);
    }

    deleteExercise(exercise: Exercise): void {
        if (!exercise.id) return;

        const confirmed = confirm(`Bạn có chắc muốn xóa bài tập "${exercise.title}"?`);
        if (confirmed) {
            this.exerciseService.deleteExercise(exercise.id).subscribe({
                next: () => {
                    this.loadExercises();
                },
                error: (error) => {
                    console.error('Error deleting exercise:', error);
                    alert('Có lỗi xảy ra khi xóa bài tập');
                }
            });
        }
    }

    duplicateExercise(exercise: Exercise): void {
        if (!exercise.id) return;

        this.exerciseService.duplicateExercise(exercise.id).subscribe({
            next: () => {
                this.loadExercises();
            },
            error: (error) => {
                console.error('Error duplicating exercise:', error);
                alert('Có lỗi xảy ra khi nhân bản bài tập');
            }
        });
    }

    previewExercise(exercise: Exercise): void {
        // TODO: Implement preview modal
        console.log('Preview exercise:', exercise);
    }



    getTypeLabel(type: ExerciseType): string {
        const labels: Record<ExerciseType, string> = {
            // Math types (not used in admin but kept for type safety)
            '3-math': 'Toán 3 số',
            'fill-blank': 'Điền chỗ trống',
            'sorting': 'Sắp xếp',
            'find-even-odd': 'Chẵn/Lẻ',
            'comparison': 'So sánh',
            // Vietnamese types
            'simple-words': 'Từ đơn giản',
            'spelling': 'Đánh vần',
            'fill-in-blank': 'Điền Chữ',
            'alphabet': 'Bảng Chữ Cái',
            'sentence-builder': 'Tạo Câu'
        };
        return labels[type];
    }

    getTypeIcon(type: ExerciseType): string {
        const icons: Record<ExerciseType, string> = {
            // Math types (not used in admin but kept for type safety)
            '3-math': '🔢',
            'fill-blank': '❓',
            'sorting': '📊',
            'find-even-odd': '🎲',
            'comparison': '⚖️',
            // Vietnamese types
            'simple-words': '📝',
            'spelling': '✏️',
            'fill-in-blank': '🧩',
            'alphabet': '🔤',
            'sentence-builder': '🧩'
        };
        return icons[type];
    }

    getDifficultyClass(difficulty: ExerciseDifficulty): string {
        const classes: Record<ExerciseDifficulty, string> = {
            'easy': 'bg-green-100 text-green-700 border-green-300',
            'medium': 'bg-yellow-100 text-yellow-700 border-yellow-300',
            'hard': 'bg-red-100 text-red-700 border-red-300'
        };
        return classes[difficulty];
    }

    getDifficultyLabel(difficulty: ExerciseDifficulty): string {
        const labels: Record<ExerciseDifficulty, string> = {
            'easy': 'Dễ',
            'medium': 'Trung bình',
            'hard': 'Khó'
        };
        return labels[difficulty];
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
        }
    }

    prevPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }

    goToPage(page: number): void {
        this.currentPage = page;
    }

    async seedData(): Promise<void> {
        if (!confirm('Bạn có chắc muốn tạo dữ liệu mẫu? (Sẽ thêm bài tập mới)')) {
            return;
        }

        this.isLoading = true;
        try {
            await this.exerciseService.seedVietnameseExercises();
            alert('✅ Tạo dữ liệu mẫu thành công!');
            this.loadExercises(); // Reload list
        } catch (error) {
            console.error('Seed error:', error);
            alert('❌ Có lỗi xảy ra khi tạo dữ liệu.');
        } finally {
            this.isLoading = false;
        }
    }
}
