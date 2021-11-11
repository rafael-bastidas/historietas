import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScreenHomePage } from './screen-home.page';

const routes: Routes = [
  {
    path: '',
    component: ScreenHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScreenHomePageRoutingModule {}
