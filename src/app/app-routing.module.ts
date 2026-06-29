import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './modules/services/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./modules/registro/registro.module').then(m => m.RegistroModule)
  },
  {
    path: 'favorites',
    loadChildren: () => import('./modules/favorites/favorites.module').then(m => m.FavoritesModule)
  },
  {
     path: '',
    loadChildren: () => import('./modules/initial/initial.module').then(m => m.initialModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
