import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InitSessionPageRoutingModule } from './init-session-routing.module';

import { InitSessionPage } from './init-session.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InitSessionPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [InitSessionPage]
})
export class InitSessionPageModule {}
