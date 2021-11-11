import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditComicsPageRoutingModule } from './edit-comics-routing.module';

import { EditComicsPage } from './edit-comics.page';
import { ConnectionBackendService } from '../services/connection-backend.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditComicsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EditComicsPage],
  providers:[
    ConnectionBackendService
  ]
})
export class EditComicsPageModule {}
