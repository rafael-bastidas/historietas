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
  mySeries:any = [
    {id:0,title:'Nueva serie',url:'https://otakuteca.com/images/books/cover/5e3417c450a2b.jpg'},
    {id:1,title:'El chavo 2',url:'https://otakuteca.com/images/books/cover/5f07608bdd5b1.jpg'},
    {id:2,title:'El chavo 3',url:'https://otakuteca.com/images/books/cover/613138f8298fd.jpg'}
  ];
  seriesFollow:any = [{id:1,title:'El chavo',url:'https://otakuteca.com/images/books/cover/5c9011191e83d.jpg'}];
  users:any = [
    {
      nickName:'don_quijote',
      series:[
        {id:1,title:'Locls',url:'https://otakuteca.com/images/books/cover/6119e410d98fd.jpg'},
        {id:1,title:'Trocha',url:'https://otakuteca.com/images/books/cover/5e3417c450a2b.jpg'}
      ]
    },
    {
      nickName:'pancho',
      series:[
        {id:1,title:'Patric El lanzador cobarde',url:'https://otakuteca.com/images/books/cover/60592a95d9de9.jpg'},
        {id:1,title:'Rations',url:'https://otakuteca.com/images/books/cover/5c2efcd42cd5e.jpg'}
      ]
    }
  ];

  constructor(private router:Router, private route:ActivatedRoute, private comBackend:ConnectionBackendService) { }

  ngOnInit() {
  
  }
  ionViewWillEnter(){
    this.verificarProfile();
    this.cargarSeries();
  }
  async cargarSeries(){
    let formData = new FormData;
    formData.append('url','contenido');
    formData.append('params','GET-INIT');
    formData.append('data',JSON.stringify({id_user:this.id_user}));
    let {response} = await this.comBackend.requestBackend(formData);
    //this.mySeries = response.myseries;
    //this.seriesFollow = response.mysuscribe;
    //this.allseries = response.series;
  }
  verSerie(numberCard:number){
    if(numberCard===0){
      this.router.navigate(['/edit-comics'], {queryParams: {id_user: '1', id_serie: '1'}});
    } else {
      console.log('ver',numberCard);
      this.router.navigate(['/pre-view-comics'], {queryParams: {id_user: '1', id_serie: '1'}})
    }
  }
  editSerie(numberCard:number){
    console.log('edit',numberCard);
  }
  deleteSerie(numberCard:number){
    console.log('delete',numberCard);
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
