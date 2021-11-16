import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreViewComicsPageRoutingModule } from './pre-view-comics-routing.module';

import { PreViewComicsPage } from './pre-view-comics.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreViewComicsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PreViewComicsPage]
})
export class PreViewComicsPageModule {}
