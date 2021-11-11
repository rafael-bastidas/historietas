import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./screen-home/screen-home.module').then( m => m.ScreenHomePageModule)
  },
  {
    path: 'init-session',
    loadChildren: () => import('./init-session/init-session.module').then( m => m.InitSessionPageModule)
  },
  {
    path: 'edit-comics',
    loadChildren: () => import('./edit-comics/edit-comics.module').then( m => m.EditComicsPageModule),
  },
  {
    path: 'view-comics',
    loadChildren: () => import('./view-comics/view-comics.module').then( m => m.ViewComicsPageModule)
  },
  {
    path: 'pre-view-comics',
    loadChildren: () => import('./pre-view-comics/pre-view-comics.module').then( m => m.PreViewComicsPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
