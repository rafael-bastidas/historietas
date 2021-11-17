import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-page',
  templateUrl: './modal-page.page.html',
  styleUrls: ['./modal-page.page.scss'],
})
export class ModalPagePage implements OnInit {

  dimension:string;
  @Input()
  diametro:string;
  label:string;

  
  constructor(public modalController: ModalController) { }

  ngOnInit() {
    this.dimension = `width:${this.diametro}px; height:${this.diametro}px;`;
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
