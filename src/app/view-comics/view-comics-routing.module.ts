import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewComicsPage } from './view-comics.page';

const routes: Routes = [
  {
    path: '',
    component: ViewComicsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewComicsPageRoutingModule {}
