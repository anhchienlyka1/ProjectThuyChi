import { Routes } from '@angular/router';
import { ParentGateGuard } from './core/guards/parent-gate.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/child-layout/child-layout.component').then(m => m.ChildLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'select-age',
        title: 'Chọn Độ Tuổi',
        loadComponent: () => import('./features/age-selection/age-selection.component').then(m => m.AgeSelectionComponent)
      },
      {
        path: 'select-subject',
        title: 'Chọn Môn Học',
        loadComponent: () => import('./features/subject-selection/subject-selection.component').then(m => m.SubjectSelectionComponent)
      },
      {
        path: 'math/counting',
        title: 'Học Đếm Số',
        loadComponent: () => import('./features/math-modules/counting/counting.component').then(m => m.CountingComponent)
      },
      {
        path: 'math/comparison',
        title: 'So Sánh',
        loadComponent: () => import('./features/math-modules/comparison/comparison.component').then(m => m.ComparisonComponent)
      },
      {
        path: 'math/addition',
        title: 'Phép Cộng',
        loadComponent: () => import('./features/math-modules/addition/addition.component').then(m => m.AdditionComponent)
      },
      {
        path: 'math/subtraction',
        title: 'Phép Trừ',
        loadComponent: () => import('./features/math-modules/subtraction/subtraction.component').then(m => m.SubtractionComponent)
      },
      {
        path: 'math/fill-in-blank',
        title: 'Điền Số',
        loadComponent: () => import('./features/math-modules/fill-in-blank/fill-in-blank.component').then(m => m.FillInBlankComponent)
      },
      {
        path: 'math/shapes',
        title: 'Hình Học',
        loadComponent: () => import('./features/math-modules/shapes/shapes.component').then(m => m.ShapesComponent)
      },
      {
        path: 'math/logic',
        title: 'Tư Duy Logic',
        loadComponent: () => import('./features/math-modules/logic/logic.component').then(m => m.LogicComponent)
      },
      {
        path: 'math/time',
        title: 'Xem Giờ',
        loadComponent: () => import('./features/math-modules/time/time.component').then(m => m.TimeComponent)
      },
      {
        path: 'math/sorting',
        title: 'Sắp Xếp',
        loadComponent: () => import('./features/math-modules/sorting/sorting.component').then(m => m.SortingComponent)
      },
      {
        path: 'math',
        title: 'Toán Học',
        loadComponent: () => import('./features/math-modules/math-modules.component').then(m => m.MathModulesComponent)
      },
      {
        path: 'vietnamese',
        title: 'Tiếng Việt',
        loadComponent: () => import('./features/vietnamese-modules/vietnamese-modules.component').then(m => m.VietnameseModulesComponent)
      },
      {
        path: 'english',
        title: 'Tiếng Anh',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'games',
        title: 'Trò Chơi',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'exam-practice',
        title: 'Bé Luyện Thi',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'fairy-tales',
        title: 'Truyện Cổ Tích',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
      }
    ]
  },
  {
    path: 'parents',
    title: 'Phụ Huynh',
    canActivate: [ParentGateGuard],
    loadComponent: () => import('./layouts/parent-layout/parent-layout.component').then(m => m.ParentLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
      }
    ]
  }
];
