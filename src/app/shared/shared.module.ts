import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FeatherModule } from 'angular-feather';
import {
  Home,
  Camera,
  Heart,
  Github,
  Instagram,
  Linkedin,
  Star,
  Play,
  ArrowLeft,
  ArrowRight,
  Pause,
  MessageCircle,
  Calendar,
  Clock,
  Frown,
  Bookmark,
  CornerUpLeft,
  ChevronLeft,
  ChevronRight,
  X,
  Search,
  LogOut,
  Tv,
  Users,
  Trash2,
  Eye,
  Mail,
  Lock,
  User,
  EyeOff
} from 'angular-feather/icons';

import { 
  MovieCardComponent, 
  WhereToWatchModalComponent, 
  MobileTabsComponent, 
  FavoriteCardComponent,
  ProviderComponent
} from './components';

const icons = {
  Home,
  Camera,
  Heart,
  Github,
  Lock,
  Eye,
  EyeOff,
  Mail,
  User,
  Instagram,
  Linkedin,
  Star,
  Play,
  ArrowLeft,
  ArrowRight,
  Pause,
  Calendar,
  Clock,
  MessageCircle,
  Frown,
  Bookmark,
  CornerUpLeft,
  ChevronLeft,
  ChevronRight,
  X,
  Search,
  LogOut,
  Tv,
  Users,
  Trash2
};

import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    MovieCardComponent, 
    WhereToWatchModalComponent, 
    MobileTabsComponent, 
    FavoriteCardComponent,
    ProviderComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    FeatherModule.pick(icons),
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MovieCardComponent,
    FeatherModule,
    WhereToWatchModalComponent,
    MobileTabsComponent,
    FavoriteCardComponent,
    ProviderComponent
  ],
  providers: [],
})
export class SharedModule {
  constructor() {}
}
