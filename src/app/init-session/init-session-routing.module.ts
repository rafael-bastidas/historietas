import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InitSessionPage } from './init-session.page';

const routes: Routes = [
  {
    path: '',
    component: InitSessionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InitSessionPageRoutingModule {}
