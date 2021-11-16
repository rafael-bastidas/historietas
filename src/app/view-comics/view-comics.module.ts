import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewComicsPageRoutingModule } from './view-comics-routing.module';

import { ViewComicsPage } from './view-comics.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewComicsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ViewComicsPage]
})
export class ViewComicsPageModule {}
