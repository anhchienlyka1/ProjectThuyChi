import { NgModule } from '@angular/core';
import { LucideAngularModule, Home, User, Settings, Menu, Search, Plus, Trash2, Edit, X, Check, ArrowRight, ArrowLeft, Star, Heart, Minus, ChevronRight, Volume2 } from 'lucide-angular';

/**
 * Define the icons you want to use in the application here.
 * This centralized registry makes it easier to manage icon bundle size.
 */
const icons = {
  Home,
  User,
  Settings,
  Menu,
  Search,
  Plus,
  Trash2,
  Edit,
  X,
  Check,
  ArrowRight,
  ArrowLeft,
  Star,
  Heart,
  Minus,
  ChevronRight,
  Volume2
};

@NgModule({
  imports: [LucideAngularModule.pick(icons)],
  exports: [LucideAngularModule]
})
export class IconsModule { }
