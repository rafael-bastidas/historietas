import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnectionBackendService } from '../services/connection-backend.service';

@Component({
  selector: 'app-screen-home',
  templateUrl: './screen-home.page.html',
  styleUrls: ['./screen-home.page.scss'],
})
export class ScreenHomePage implements OnInit {

  nickName:string = 'Invitado';
  id_user:string = '-1';
  mySeries:any = [{id_serie:0,titulo:'Nueva serie',descripcion:'',imgportada:''}];
  seriesFollow:any = [];
  users:any = [];

  constructor(private router:Router, private route:ActivatedRoute, private comBackend:ConnectionBackendService) { }

  ngOnInit() {
  
  }
  ionViewWillEnter(){
    this.verificarProfile();
    this.cargarSeries();
  }
  async cargarSeries(){
    this.initVariables();
    let formData = new FormData;
    formData.append('url','contenido');
    formData.append('params','GET-INIT');
    formData.append('data',JSON.stringify({id_user:this.id_user}));
    let {response} = await this.comBackend.requestBackend(formData);
    for (let index = 0; index < response.myseries.length; index++) {
      const element = response.myseries[index];
      this.mySeries.push(element);
    }
    this.seriesFollow = response.mysuscribe;
    let series=[];
    for (let index = 0; index < response.series.length; index++) {
      const element = response.series[index];
      const elementBack = index !== 0 ? response.series[index-1] : response.series[index];
      
      //series.push({id_serie:element.id_serie, titulo:element.titulo, descripcion:element.descripcion, imgportada:element.imgportada});
      if (element.id_user !== elementBack.id_user && index+1 !== response.series.length){
        this.users.push({id_user:elementBack.id_user, nickname:elementBack.nickname, series:series});
        series=[];
      } else if (element.id_user === elementBack.id_user && index+1 === response.series.length) {
        this.users.push({id_user:elementBack.id_user, nickname:elementBack.nickname, series:series});
      } else if (element.id_user !== elementBack.id_user && index+1 === response.series.length) {
        this.users.push({id_user:elementBack.id_user, nickname:elementBack.nickname, series:series});
        series=[];
        this.users.push({id_user:element.id_user, nickname:element.nickname, series:[
          {id_serie:element.id_serie, titulo:element.titulo, descripcion:element.descripcion, imgportada:element.imgportada}
        ]});
      }
      series.push({id_serie:element.id_serie, titulo:element.titulo, descripcion:element.descripcion, imgportada:element.imgportada});
    }console.log(this.users);
  }
  initVariables(){
    this.mySeries = [{id_serie:0,titulo:'Nueva serie',descripcion:'',imgportada:''}];
    this.seriesFollow = [];
    this.users = [];
  }
  verSerie(numberCard:number){
    if(numberCard===0){
      this.router.navigate(['/edit-comics'], {queryParams: {id_serie: numberCard}});
    } else {
      console.log('ver id_serie',numberCard);
      this.router.navigate(['/pre-view-comics'], {queryParams: {id_serie: numberCard}})
    }
  }
  editSerie(numberCard:number){
    console.log('edit id_serie',numberCard);
    this.router.navigate(['/edit-comics'], {queryParams: {id_serie: numberCard}})
  }
  async deleteSerie(numberCard:number){
    console.log('delete',numberCard);

    let formData = new FormData;
    formData.append('url','contenido');
    formData.append('params','DELETE-SERIE');
    formData.append('data',JSON.stringify({id_serie:numberCard}));
    let { response } = await this.comBackend.requestBackend(formData);
    if (response) {
      let art = this.mySeries.map(serie => { return serie.id_serie !== numberCard ? 0 : 1 }).findIndex(element => element === 1);
      this.mySeries.splice(art,1);

      let index_series;
      let index_users = this.users.map(user => {
        index_series = user.series.map(serie => { return serie.id_serie !== numberCard ? 0 : 1 }).findIndex(element => element === 1);
        return index_series !== -1 ? 1 : 0; 
      }).findIndex(element => element === 1);
      index_series = this.users[index_users].series.map(serie => { return serie.id_serie !== numberCard ? 0 : 1 }).findIndex(element => element === 1);
      this.users[index_users].series.splice(index_series,1);
    }  
  }
  verificarProfile(){
    if (localStorage.getItem('user')!==null){
      localStorage.getItem('user')!=='Invitado'?this.nickName = localStorage.getItem('user'):'';
      localStorage.getItem('id_user')!=='-1'?this.id_user = localStorage.getItem('id_user'):'';
    } else if (localStorage.getItem('user')===null) {
      this.nickName = 'Invitado'
      this.id_user = '-1'
    }
  }

}
