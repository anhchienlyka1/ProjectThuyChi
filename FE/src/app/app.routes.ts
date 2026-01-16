import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

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
        path: 'login',
        title: 'Đăng nhập',
        loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'profile',
        title: 'Hồ Sơ Của Bé',
        loadComponent: () => import('./features/profile/profile').then(m => m.ProfileComponent)
      },
      {
        path: 'profile/badges',
        title: 'Bộ Sưu Tập Huy Hiệu',
        loadComponent: () => import('./features/profile/my-badges/my-badges.component').then(m => m.MyBadgesComponent)
      },
      {
        path: 'profile/certificates',
        title: 'Phiếu Bé Ngoan',
        loadComponent: () => import('./features/profile/my-certificates/my-certificates.component').then(m => m.MyCertificatesComponent)
      },

      {
        path: 'select-age',
        redirectTo: 'select-subject',
        pathMatch: 'full'
      },
      {
        path: 'select-subject',
        title: 'Chọn Môn Học',
        loadComponent: () => import('./features/subject-selection/subject-selection.component').then(m => m.SubjectSelectionComponent)
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
        path: 'vietnamese/alphabet',
        title: 'Bảng Chữ Cái',
        loadComponent: () => import('./features/vietnamese-modules/alphabet/alphabet.component').then(m => m.AlphabetComponent)
      },
      {
        path: 'vietnamese/simple-words',
        title: 'Ghép Từ Đơn',
        loadComponent: () => import('./features/vietnamese-modules/simple-words/simple-words.component').then(m => m.SimpleWordsComponent)
      },
      {
        path: 'vietnamese/spelling',
        title: 'Tập Đánh Vần',
        loadComponent: () => import('./features/vietnamese-modules/spelling/spelling.component').then(m => m.SpellingComponent)
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
        loadComponent: () => import('./features/games/games-selection/games-selection.component').then(m => m.GamesSelectionComponent)
      },
      {
        path: 'games/tug-of-war',
        title: 'Đường đua Trí Tuệ',
        loadComponent: () => import('./features/games/tug-of-war/tug-of-war.component').then(m => m.TugOfWarComponent)
      },
      {
        path: 'games/treasure-hunt',
        title: 'Săn Kho Báu Toán Học',
        loadComponent: () => import('./features/games/treasure-hunt/treasure-hunt.component').then(m => m.TreasureHuntComponent)
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
    path: 'parent-gate',
    title: 'Xác thực Phụ Huynh',
    loadComponent: () => import('./features/parent-gate/parent-gate.component').then(m => m.ParentGateComponent)
  },
  {
    path: 'parents',
    title: 'Phụ Huynh',
    canActivate: [AuthGuard],
    loadComponent: () => import('./layouts/parent-layout/parent-layout.component').then(m => m.ParentLayoutComponent),
    children: [
      {
        path: '',
        title: 'Tổng quan - Góc Phụ Huynh',
        loadComponent: () => import('./features/parent-dashboard/parent-dashboard.component').then(m => m.ParentDashboardComponent)
      },
      {
        path: 'history',
        title: 'Lịch sử học tập - Góc Phụ Huynh',
        loadComponent: () => import('./features/parent-dashboard/learning-history.component').then(m => m.LearningHistoryComponent)
      },
      {
        path: 'settings',
        title: 'Cài đặt - Góc Phụ Huynh',
        loadComponent: () => import('./features/parent-dashboard/parent-settings.component').then(m => m.ParentSettingsComponent)
      },
      {
        path: 'reports',
        title: 'Báo cáo - Góc Phụ Huynh',
        loadComponent: () => import('./features/parent-dashboard/learning-report.component').then(m => m.LearningReportComponent)
      },

    ]
  }
];
