import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides, ModalController } from '@ionic/angular';
import { ModalPagePage } from '../modal-page/modal-page.page';
import { ConnectionBackendService } from '../services/connection-backend.service';

declare let window:any;

@Component({
  selector: 'app-view-comics',
  templateUrl: './view-comics.page.html',
  styleUrls: ['./view-comics.page.scss'],
})
export class ViewComicsPage implements OnInit,OnDestroy {

  despNatural:boolean = true;
  modal;
  fotogramas:Array<{id_fotograma:number,id_episodio:number,number_fotograma:number,imagen:string}> = [];
  inputComentario:FormControl = new FormControl('', Validators.required);
  id_user = '-1';
  nickName:string = 'Invitado';
  //comentarios:Array<{id_comentariofoto:number, id_fotograma:number, id_user:number, nickname?:string, comentario:string}> = [];
  comentariosall:Array<Array<{id_comentariofoto:number, id_fotograma:number, id_user:number, nickname?:string, comentario:string}>> = [];
  flatEditComment:{active:boolean,id:number} = {active:false,id:0};
  contraer_expandir:{style:string,iconname:string,flatcomentario:boolean} = {style:"width: 100%; height: 100%;",iconname:"contract-outline",flatcomentario:false};

  selectMultiproposito:FormControl = new FormControl('', Validators.required);
  optionsSelect:Array<{value:number,label:string}> = [];

  @ViewChild(IonSlides) slides: IonSlides;
  optionSlides = { slidesPerView:'auto', zoom:false, grabCursor:true, direction:'horizontal'};
  index_slides:number = 0;
  index_seudoslides:number = 0;

  constructor(private router:Router, private route:ActivatedRoute, private comBackend:ConnectionBackendService,
    public modalController: ModalController) { }

  ngOnInit() {
  }
  async ngOnDestroy(){
    console.log("Guardando estado...");
    if (this.id_user !== '-1') {
      let formData = new FormData;
      formData.append('url','contenido');
      formData.append('params','UPDATE-VIEW-MYSUSCRIBE');
      let avance_fotograma = this.despNatural ? this.index_seudoslides : this.fotogramas.length - this.index_seudoslides - 1;
      formData.append('data',JSON.stringify({id_episodio:this.param_id_episodio,id_user:this.id_user,avance_fotograma:avance_fotograma}));
      await this.comBackend.requestBackend(formData);
    }
  }
  async ionViewWillEnter(){
    await this.presentModal('Cargando..');
    this.verificarProfile();
    await this.cargarFotogramas();
    this.selectMultiproposito.valueChanges.subscribe(value => {
      console.log("que paso?", value) 
      if (value < 0) { this.configOrientacion() } else { this.configPage() }
    });
    this.modal.dismiss();
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
    formData.append('data',JSON.stringify({id_episodio:this.param_id_episodio,id_user:this.id_user}));
    let {response} = await this.comBackend.requestBackend(formData);
    this.fotogramas = response.fotogramas;

    this.comentariosall = this.fotogramas.map(fotograma => {
      let comentarios = [];
      for (let index = 0; index < response.comentariofoto.length; index++) {
        const comentario = response.comentariofoto[index];
        comentario.id_fotograma == fotograma.id_fotograma ? comentarios.push(comentario) : '';
      }
      return comentarios;
    });

    response.avance_fotograma.length === 1 ?
     this.slides.slideTo(Number.parseInt(response.avance_fotograma[0].avance_fotograma),100) : console.log("El usuario no tiene avance");
  }
  async uploadComentario(){
    let index_slide_uploadComentario = this.index_slides;
    let id_fotograma_uploadComentario = this.fotogramas[index_slide_uploadComentario].id_fotograma;
    let params = "INSERT-COMENTARIOFOTO";
    let data:any = {id_fotograma:id_fotograma_uploadComentario,id_user:Number.parseInt(this.id_user),comentario:this.inputComentario.value};

    if (this.flatEditComment.active) {
      params = "UPDATE-COMENTARIOFOTO";
      data = {id_comentariofoto:this.flatEditComment.id, id_fotograma:id_fotograma_uploadComentario,id_user:Number.parseInt(this.id_user),comentario:this.inputComentario.value};
    }

    let formData = new FormData;
    formData.append('url','contenido');
    formData.append('params',params);
    formData.append('data',JSON.stringify(data));
    let {response} = await this.comBackend.requestBackend(formData);
    if (response > 0){
      if (this.flatEditComment.active) {
        let index_comment = this.comentariosall[index_slide_uploadComentario].map(comentario => { return comentario.id_comentariofoto !== this.flatEditComment.id ? 0 : 1 }).findIndex(element => element === 1);
        this.comentariosall[index_slide_uploadComentario][index_comment].comentario = this.inputComentario.value;
        this.flatEditComment = {active:false,id:0};
      } else {
        this.comentariosall[index_slide_uploadComentario].push({id_comentariofoto:response, id_user:Number.parseInt(this.id_user), id_fotograma:data.id_fotograma, comentario:this.inputComentario.value,nickname:this.nickName});
      }
      this.inputComentario.reset();
    } else {
      //console.log('Hubo un error');
    }
  }
  async editComentario(card) {
    let index_slide_uploadComentario = this.index_slides;
    //console.log("Actualizando id_comentario: ", card.id_comentariofoto, "asoc. al id_fotograma:",this.fotogramas[index_slide_uploadComentario].id_fotograma);
    this.flatEditComment = {active:true,id:card.id_comentariofoto};
    this.inputComentario.setValue(card.comentario);
  }
  async deleteComentario(card) {
    let index_slide_uploadComentario = this.index_slides;
    //console.log("Eliminando id_comentario: ", card.id_comentariofoto, "asoc. al id_fotograma:",this.fotogramas[index_slide_uploadComentario].id_fotograma);

    let formData = new FormData;
    formData.append('url','contenido');
    formData.append('params','DELETE-COMENTARIOFOTO');
    formData.append('data',JSON.stringify({id_comentariofoto:card.id_comentariofoto}));
    let {response} = await this.comBackend.requestBackend(formData);
    if (response){
      let index_comment = this.comentariosall[index_slide_uploadComentario].map(comentario => { return comentario.id_comentariofoto !== card.id_comentariofoto ? 0 : 1 }).findIndex(element => element === 1);
      this.comentariosall[index_slide_uploadComentario].splice(index_comment, 1);
    } else {console.log("Error")}
  }
  contraerExpandir(){
    if (this.contraer_expandir.flatcomentario){
      this.contraer_expandir = {style:"width: 100%; height: 100%;",iconname:"contract-outline",flatcomentario:false};
    }else{
      this.contraer_expandir = {style:"width: 50%; margin-inline: auto;",iconname:"expand-outline",flatcomentario:true};
    }

    this.slides.update();
    //this.slides.updateAutoHeight();
  }
  async cambiarSlide(){
    this.index_slides = await this.slides.getActiveIndex();
    if (this.despNatural) {
      this.index_seudoslides = this.index_slides;
    } else {
      this.index_seudoslides = this.fotogramas.length - this.index_slides - 1;
      this.index_slides = this.index_seudoslides;
    }
    console.log("indexSeudoSlides", this.index_seudoslides, "indexSlide:", this.index_slides, "id_fotograma:",this.fotogramas[this.index_slides].id_fotograma);
  }
  configOptionsOrientacion(){
    this.optionsSelect = [
      {value: -1, label: 'Despl. hacia la derecha'},
      {value: -2, label: 'Despl. hacia la izquierda'},
      {value: -3, label: 'Despl. hacia la arriba'},
      {value: -4, label: 'Despl. hacia la abajo'}
    ];
    setTimeout(()=>{
      document.getElementById("selectorMultiple").click();
    },100);
  }
  configOrientacion(){
    //console.log("Se modifico la orientacion", this.selectMultiproposito.value);
    if (this.selectMultiproposito.value === -1 || this.selectMultiproposito.value === -2) {
      this.optionSlides.direction = 'horizontal';
      setTimeout(() => {
        if (this.despNatural) {
          this.index_seudoslides = this.index_slides;
          this.slides.slideTo(this.index_seudoslides,100);
        } else {
          this.index_seudoslides = this.fotogramas.length - this.index_slides - 1;
          this.index_slides = this.index_seudoslides;
          this.slides.slideTo(this.index_seudoslides,100);
        }
      }, 100);
      if (this.selectMultiproposito.value === -1 && !this.despNatural) {
        this.fotogramas.reverse();
        this.despNatural = true;
      } else if (this.selectMultiproposito.value === -2 && this.despNatural) {
        this.fotogramas.reverse();
        this.despNatural = false;
      }
    } else if (this.selectMultiproposito.value === -3 || this.selectMultiproposito.value === -4) {
      this.optionSlides.direction = 'vertical'
      setTimeout(() => {
        if (this.despNatural) {
          this.index_seudoslides = this.index_slides;
          this.slides.slideTo(this.index_seudoslides,100);
        } else {
          this.index_seudoslides = this.fotogramas.length - this.index_slides - 1;
          this.index_slides = this.index_seudoslides;
          this.slides.slideTo(this.index_seudoslides,100);
        }
      }, 100);
      if (this.selectMultiproposito.value === -3 && !this.despNatural) {
        this.fotogramas.reverse();
        this.despNatural = true;
      } else if (this.selectMultiproposito.value === -4 && this.despNatural) {
        this.fotogramas.reverse();
        this.despNatural = false;
      }
    }
    this.slides.update();
    this.optionsSelect = [];
  }
  configOptionsPage(){
    this.optionsSelect = this.fotogramas.map(fotograma => {
      return {value: fotograma.number_fotograma, label: `Fotograma ${fotograma.number_fotograma}`};
    });
    setTimeout(()=>{
      document.getElementById("selectorMultiple").click();
    },100);
  }
  configPage(){
    //console.log("Se modifico el numero de pagina a", this.selectMultiproposito.value);
    if (this.despNatural) {
      let position = Number.parseInt(this.selectMultiproposito.value) - 1;
      this.slides.slideTo(position,100);
    } else {
      let position = this.fotogramas.length - Number.parseInt(this.selectMultiproposito.value) - 1;
      this.slides.slideTo(position,100);
    }
    this.optionsSelect = [];
  }
  async presentModal(label) {
    this.modal = await this.modalController.create({
      component: ModalPagePage,
      componentProps: {
        diametro: '150',
        label:label
      }
    });
    return await this.modal.present();
  }
  compartir(){
    window.plugins.socialsharing.share(null, null, this.param_url_shared, null);
  }

  get param_url_shared() { return this.route.snapshot.queryParamMap.get('url_shared') };
  get param_id_episodio() { return this.route.snapshot.queryParamMap.get('id_episodio') };
  get name_btn_comentar() { return this.flatEditComment.active ? 'Actualizar' : 'Comentar' };
}