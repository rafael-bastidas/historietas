import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pre-view-comics',
  templateUrl: './pre-view-comics.page.html',
  styleUrls: ['./pre-view-comics.page.scss'],
})
export class PreViewComicsPage implements OnInit {

  nickName:string = 'Invitado';

  constructor() { }

  ngOnInit() {
    this.verificarProfile();
  }
  verificarProfile(){
    if (localStorage.getItem('user')!==null){
      localStorage.getItem('user')!=='Invitado'?this.nickName = localStorage.getItem('user'):'';
    } console.log(this.nickName, localStorage.getItem('user'));
  }

}
