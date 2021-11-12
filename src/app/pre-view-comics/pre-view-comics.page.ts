import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnectionBackendService } from '../services/connection-backend.service';

@Component({
  selector: 'app-pre-view-comics',
  templateUrl: './pre-view-comics.page.html',
  styleUrls: ['./pre-view-comics.page.scss'],
})
export class PreViewComicsPage implements OnInit {

  nickName:string = 'Invitado';
  id_user = '-1';
  serie = {id_serie:0,titulo:'',descripcion:'',imgportada:''}
  suscrito = 0;

  constructor(private router:Router, private route:ActivatedRoute, private comBackend:ConnectionBackendService) { }

  ngOnInit() { }
  ionViewWillEnter(){
    this.verificarProfile();
    this.cargarSeries();
  }
  verificarProfile(){
    if (localStorage.getItem('user')!==null){
      localStorage.getItem('user')!=='Invitado'?this.nickName = localStorage.getItem('user'):'';
      localStorage.getItem('id_user')!=='-1'?this.id_user = localStorage.getItem('id_user'):'';
    } else if (localStorage.getItem('user')===null) {
      this.nickName = 'Invitado';
      this.id_user = '-1';
    }
  }
  async cargarSeries(){
    let formData = new FormData;
    formData.append('url','contenido');
    formData.append('params','GET-PRE-VIEW');
    formData.append('data',JSON.stringify({id_serie:this.param_id_serie,id_user:Number.parseInt(this.id_user)}));
    let {response} = await this.comBackend.requestBackend(formData);
    this.serie = response.serie[0]; 
    this.suscrito = response.suscrito;
  }

  get param_id_serie() { return this.route.snapshot.queryParamMap.get('id_serie') }
}
