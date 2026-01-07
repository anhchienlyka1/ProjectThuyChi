import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
    selector: 'app-parent-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink],
    template: `
    <div class="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">

      <!-- Top Bar -->
      <header class="bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b border-gray-200">
        <div class="flex items-center gap-2">
           <h1 class="text-xl font-bold text-gray-700">Góc Phụ Huynh</h1>
           <span class="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">Admin</span>
        </div>
        <button routerLink="/" class="text-sm text-gray-500 hover:text-blue-600 font-medium">
          ← Quay lại màn hình Bé
        </button>
      </header>

      <div class="flex flex-1">
        <!-- Sidebar -->
        <aside class="w-64 bg-white border-r border-gray-200 hidden md:block">
          <nav class="p-4 space-y-1">
            <a href="#" class="block px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-bold">Tổng quan</a>
            <a href="#" class="block px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900">Cài đặt thời gian</a>
            <a href="#" class="block px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900">Lịch sử học tập</a>
            <a href="#" class="block px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900">Quản lý khoá học</a>
          </nav>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 p-6 md:p-8 overflow-y-auto">
          <router-outlet></router-outlet>
        </main>
      </div>

    </div>
  `
})
export class ParentLayoutComponent { }
