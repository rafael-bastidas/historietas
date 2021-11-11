import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreViewComicsPage } from './pre-view-comics.page';

const routes: Routes = [
  {
    path: '',
    component: PreViewComicsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreViewComicsPageRoutingModule {}
