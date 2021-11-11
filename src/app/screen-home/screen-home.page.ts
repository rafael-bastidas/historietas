import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-screen-home',
  templateUrl: './screen-home.page.html',
  styleUrls: ['./screen-home.page.scss'],
})
export class ScreenHomePage implements OnInit {

  nickName:string = 'Invitado';
  mySeries:any = [
    {id:0,title:'Nueva serie',url:'https://otakuteca.com/images/books/cover/5e3417c450a2b.jpg'},
    {id:1,title:'El chavo 2',url:'https://otakuteca.com/images/books/cover/5e3417c450a2b.jpg'},
    {id:2,title:'El chavo 3',url:'https://otakuteca.com/images/books/cover/5e3417c450a2b.jpg'}
  ];
  seriesFollow:any = [{id:1,title:'El chavo',url:'https://otakuteca.com/images/books/cover/5e3417c450a2b.jpg'}];
  users:any = [
    {
      nickName:'don_quijote',
      series:[
        {id:1,title:'Locls',url:'https://otakuteca.com/images/books/cover/5e3417c450a2b.jpg'},
        {id:1,title:'Trocha',url:'https://otakuteca.com/images/books/cover/5e3417c450a2b.jpg'}
      ]
    },
    {
      nickName:'pancho',
      series:[
        {id:1,title:'Patric El lanzador cobarde',url:'https://otakuteca.com/images/books/cover/5e3417c450a2b.jpg'},
        {id:1,title:'Rations',url:'https://otakuteca.com/images/books/cover/5e3417c450a2b.jpg'}
      ]
    }
  ];

  constructor(private router:Router, private route:ActivatedRoute) { }

  ngOnInit() {
    //this.nickName = this.route.snapshot.queryParamMap.get('id');
    this.verificarProfile();
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
    } console.log(this.nickName, localStorage.getItem('user'));
  }

}
