import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditComicsPage } from './edit-comics.page';

const routes: Routes = [
  {
    path: '',
    component: EditComicsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditComicsPageRoutingModule {}
