import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { ConnectionBackendService } from '../services/connection-backend.service';

@Component({
  selector: 'app-view-comics',
  templateUrl: './view-comics.page.html',
  styleUrls: ['./view-comics.page.scss'],
})
export class ViewComicsPage implements OnInit {

  fotogramas:Array<{id_fotograma:number,id_episodio:number,number_fotograma:number,imagen:string}> = [];
  inputComentario:FormControl = new FormControl('', Validators.required);
  id_user = '-1';
  nickName:string = 'Invitado';
  comentarios:Array<{id_comentariofoto:number, id_user:number, nickname:string, comentario:string}> = [{id_comentariofoto:1, id_user:1, nickname:"rarabala", comentario:"Hw"}];
  flatEditComment:{active:boolean,id:number} = {active:false,id:0};
  contraer_expandir:{style:string,iconname:string,flatcomentario:boolean} = {style:"width: 100%;",iconname:"contract-outline",flatcomentario:false};

  @ViewChild(IonSlides) slides: IonSlides;
  index_slides:number;

  constructor(private router:Router, private route:ActivatedRoute, private comBackend:ConnectionBackendService) { }

  ngOnInit() {
  }
  ionViewWillEnter(){
    this.verificarProfile();
    this.cargarFotogramas();
  }
  verificarProfile() {
    if (localStorage.getItem('user')!==null){
      localStorage.getItem('user')!=='Invitado'?this.nickName = localStorage.getItem('user'):'';
      localStorage.getItem('id_user')!=='-1'?this.id_user = localStorage.getItem('id_user'):'';
    } else if (localStorage.getItem('user')===null) {
      this.nickName = 'Invitado';
      this.id_user = '-1';
    }
  }
  async cargarFotogramas() {
    let formData = new FormData;
    formData.append('url','contenido');
    formData.append('params','GET-VIEW-FOTOGRAMAS');
    formData.append('data',JSON.stringify({id_episodio:this.param_id_episodio}));
    let {response} = await this.comBackend.requestBackend(formData);
    this.fotogramas = response.fotogramas;
    this.comentarios = response.comentariofoto;
  }
  async uploadComentario(){
    let params = "INSERT-COMENTARIOFOTO";
    let data:any = {id_episodio:this.param_id_episodio,id_user:Number.parseInt(this.id_user),comentario:this.inputComentario.value};

    if (this.flatEditComment.active) {
      params = "UPDATE-COMENTARIOFOTO";
      data = {id_comentariofoto:this.flatEditComment.id, id_episodio:this.param_id_episodio,id_user:Number.parseInt(this.id_user),comentario:this.inputComentario.value};
    }

    let formData = new FormData;
    formData.append('url','contenido');
    formData.append('params',params);
    formData.append('data',JSON.stringify(data));
    let {response} = await this.comBackend.requestBackend(formData);
    if (response > 0){
      if (this.flatEditComment.active) {
        let index_comment = this.comentarios.map(comentario => { return comentario.id_comentariofoto !== this.flatEditComment.id ? 0 : 1 }).findIndex(element => element === 1);
        this.comentarios[index_comment].comentario = this.inputComentario.value;
        this.flatEditComment = {active:false,id:0};
      } else {
        this.comentarios.push({id_comentariofoto:response, id_user:Number.parseInt(this.id_user), nickname:this.nickName, comentario:this.inputComentario.value});
      }
      this.inputComentario.reset();
    } else {
      console.log('Hubo un error');
    }
  }
  async editComentario(card) {
    console.log("Actualizando id_comentario: ", card.id_comentariofoto);
    this.flatEditComment = {active:true,id:card.id_comentariofoto};
    this.inputComentario.setValue(card.comentario);
  }
  async deleteComentario(card) {
    console.log("Eliminando id_comentario: ", card.id_comentariofoto);

    let formData = new FormData;
    formData.append('url','contenido');
    formData.append('params','DELETE-COMENTARIOFOTO');
    formData.append('data',JSON.stringify({id_comentariofoto:card.id_comentariofoto}));
    let {response} = await this.comBackend.requestBackend(formData);
    if (response){
      let index_comment = this.comentarios.map(comentario => { return comentario.id_comentariofoto !== card.id_comentariofoto ? 0 : 1 }).findIndex(element => element === 1);
      this.comentarios.splice(index_comment, 1);
    } else {console.log("Error")}
  }
  contraerExpandir(){
    if (this.contraer_expandir.flatcomentario){
      this.contraer_expandir = {style:"width: 100%;",iconname:"contract-outline",flatcomentario:false};
    }else{
      this.contraer_expandir = {style:"width: 50%; margin-inline: auto;",iconname:"expand-outline",flatcomentario:true};
    }
    this.slides.update();
  }
  async cambiarSlide(){
    this.index_slides = await this.slides.getActiveIndex()
    console.log("Cambio a:", this.index_slides)
    
  }

  get param_id_episodio() { return this.route.snapshot.queryParamMap.get('id_episodio') };
  get name_btn_comentar() { return this.flatEditComment.active ? 'Actualizar' : 'Comentar' };
}