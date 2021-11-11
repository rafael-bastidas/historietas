import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScreenHomePageRoutingModule } from './screen-home-routing.module';

import { ScreenHomePage } from './screen-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScreenHomePageRoutingModule
  ],
  declarations: [ScreenHomePage],
  providers:[ ]
})
export class ScreenHomePageModule {}
