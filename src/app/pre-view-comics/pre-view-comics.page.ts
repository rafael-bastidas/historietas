import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnectionBackendService } from '../services/connection-backend.service';

@Component({
  selector: 'app-pre-view-comics',
  templateUrl: './pre-view-comics.page.html',
  styleUrls: ['./pre-view-comics.page.scss'],
})
export class PreViewComicsPage implements OnInit {

  selectEpisode:FormControl = new FormControl('', Validators.required);
  inputComentario:FormControl = new FormControl('', Validators.required);
  nickName:string = 'Invitado';
  id_user = '-1';
  serie = {id_serie:0,titulo:'',descripcion:'',imgportada:''};
  suscrito = 0;
  episodios:Array<{id_episodio:number, number_episodio:number}> = [{id_episodio:1, number_episodio:1}];
  comentarios:Array<{id_comentarioserie:number, id_user:number, nickname:string, comentario:string}> = [{id_comentarioserie:1, id_user:1, nickname:"rarabala", comentario:"Hw"}];
  flatEditComment:{active:boolean,id:number} = {active:false,id:0};

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
    this.episodios = response.episodios;
    this.comentarios = response.comentarioserie;
  }
  async btnSuscribir(e:number){
    let formData = new FormData;
    formData.append('url','contenido');
    formData.append('params','UPDATE-MYSUSCRIBE');
    formData.append('data',JSON.stringify({id_serie:this.param_id_serie,id_user:Number.parseInt(this.id_user)}));
    let {response} = await this.comBackend.requestBackend(formData);
    response ? this.suscrito = e : console.log('Hubo un error');
  }
  async verEpisodio(){
    console.log("Ver episodio: ", this.selectEpisode.value);

    this.router.navigate(['/view-comics'],{queryParams:{id_episodio:this.selectEpisode.value}})
  }
  async uploadComentario(){
    let params = "INSERT-COMENTARIOSERIE";
    let data:any = {id_serie:this.param_id_serie,id_user:Number.parseInt(this.id_user),comentario:this.inputComentario.value};

    if (this.flatEditComment.active) {
      params = "UPDATE-COMENTARIOSERIE";
      data = {id_comentarioserie:this.flatEditComment.id, id_serie:this.param_id_serie,id_user:Number.parseInt(this.id_user),comentario:this.inputComentario.value};
    }

    let formData = new FormData;
    formData.append('url','contenido');
    formData.append('params',params);
    formData.append('data',JSON.stringify(data));
    let {response} = await this.comBackend.requestBackend(formData);
    if (response > 0){
      if (this.flatEditComment.active) {
        let index_comment = this.comentarios.map(comentario => { return comentario.id_comentarioserie !== this.flatEditComment.id ? 0 : 1 }).findIndex(element => element === 1);
        this.comentarios[index_comment].comentario = this.inputComentario.value;
        this.flatEditComment = {active:false,id:0};
      } else {
        this.comentarios.push({id_comentarioserie:response, id_user:Number.parseInt(this.id_user), nickname:this.nickName, comentario:this.inputComentario.value});
      }
      this.inputComentario.reset();
    } else {
      console.log('Hubo un error');
    }
  }
  async editComentario(card) {
    console.log("Actualizando id_comentario: ", card.id_comentarioserie);
    this.flatEditComment = {active:true,id:card.id_comentarioserie};
    this.inputComentario.setValue(card.comentario);
  }
  async deleteComentario(card) {
    console.log("Eliminando id_comentario: ", card.id_comentarioserie);

    let formData = new FormData;
    formData.append('url','contenido');
    formData.append('params','DELETE-COMENTARIOSERIE');
    formData.append('data',JSON.stringify({id_comentarioserie:card.id_comentarioserie}));
    let {response} = await this.comBackend.requestBackend(formData);
    if (response){
      let index_comment = this.comentarios.map(comentario => { return comentario.id_comentarioserie !== card.id_comentarioserie ? 0 : 1 }).findIndex(element => element === 1);
      this.comentarios.splice(index_comment, 1);
    } else {console.log("Error")}
  }

  get param_id_serie() { return this.route.snapshot.queryParamMap.get('id_serie') };
  get name_btn_comentar() { return this.flatEditComment.active ? 'Actualizar' : 'Comentar' };
}
