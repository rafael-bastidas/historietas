import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewComicsPageRoutingModule } from './view-comics-routing.module';

import { ViewComicsPage } from './view-comics.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewComicsPageRoutingModule
  ],
  declarations: [ViewComicsPage]
})
export class ViewComicsPageModule {}
