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
        path: 'math',
        title: 'Toán Học',
        loadComponent: () => import('./features/math-modules/math-modules.component').then(m => m.MathModulesComponent)
      },
      {
        path: 'vietnamese',
        title: 'Tiếng Việt',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
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
