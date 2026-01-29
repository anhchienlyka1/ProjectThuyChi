import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ExerciseService } from '../../core/services/exercise.service';
import { ExerciseStats } from '../../core/models/exercise.model';
import { KidButtonComponent } from '../../shared/ui-kit/kid-button/kid-button.component';

interface StatCard {
  title: string;
  value: number | string;
  icon: string;
  gradient: string;
  textColor: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, KidButtonComponent],
  templateUrl: './admin-dashboard.component.html',
  styles: []
})
export class AdminDashboardComponent implements OnInit {
  private exerciseService = inject(ExerciseService);
  private router = inject(Router);

  statsCards: StatCard[] = [];
  exerciseTypesBreakdown: any[] = [];

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.exerciseService.getExerciseStats().subscribe({
      next: (stats: ExerciseStats) => {
        this.statsCards = [
          {
            title: 'Tổng bài tập',
            value: stats.totalExercises,
            icon: '📚',
            gradient: 'from-purple-400 to-purple-600',
            textColor: 'text-white'
          },
          {
            title: 'Đã xuất bản',
            value: stats.publishedExercises,
            icon: '✅',
            gradient: 'from-green-400 to-green-600',
            textColor: 'text-white'
          },
          {
            title: 'Bản nháp',
            value: stats.draftExercises,
            icon: '📝',
            gradient: 'from-yellow-400 to-orange-500',
            textColor: 'text-white'
          },
          {
            title: 'Hoàn thành hôm nay',
            value: '0',
            icon: '🎯',
            gradient: 'from-blue-400 to-blue-600',
            textColor: 'text-white'
          }
        ];

        this.exerciseTypesBreakdown = [
          { label: 'Toán 3 số', icon: '🔢', count: stats.exercisesByType['3-math'] },
          { label: 'Điền chỗ trống', icon: '❓', count: stats.exercisesByType['fill-blank'] },
          { label: 'Sắp xếp', icon: '📊', count: stats.exercisesByType['sorting'] },
          { label: 'Chẵn/Lẻ', icon: '🎲', count: stats.exercisesByType['find-even-odd'] },
          { label: 'So sánh', icon: '⚖️', count: stats.exercisesByType['comparison'] }
        ];
      },
      error: (error: unknown) => {
        console.error('Error loading stats:', error);
      }
    });
  }

  navigateToCreateExercise(): void {
    this.router.navigate(['/admin/exercises/new']);
  }

  navigateToExercises(): void {
    this.router.navigate(['/admin/exercises']);
  }

  navigateToStats(): void {
    this.router.navigate(['/admin/stats']);
  }
}
