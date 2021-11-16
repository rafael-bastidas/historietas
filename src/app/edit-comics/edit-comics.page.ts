import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConnectionBackendService } from '../services/connection-backend.service';

@Component({
  selector: 'app-edit-comics',
  templateUrl: './edit-comics.page.html',
  styleUrls: ['./edit-comics.page.scss'],
})
export class EditComicsPage implements OnInit {

  episodes:Array<{id_episodio?:number,id_serie?:number,number_episodio?:number}> = [];
  labelEpisode:number;
  fotogramas:Array<{id_fotograma?:number,id_episodio?:number,number_fotograma?:number}> = [];
  title:FormControl = new FormControl('', Validators.required);
  description:FormControl = new FormControl('', Validators.required);
  episodeSelect:FormControl = new FormControl('', Validators.required);
  flatEpisode:boolean = false;
  nickName:string = 'Invitado';
  id_user:string = '-1';
  file_imgportada = "";
  url_local_imgportada:Array<any> = [];
  url_local_imgfotogramas:Array<any> = [];
  file_imgfotogramas:Array<{file:any,number_fotograma_asoc:number}> = [];
  number_asoc_fotograma_edit:number = 0;

  id_serie;

  array_deleteFotograma:Array<{id_fotograma:number,id_episodio:number}> = [];

  constructor(private comBackend:ConnectionBackendService, private route:ActivatedRoute) { }

  ngOnInit() { }
  ionViewWillEnter(){
    this.id_serie = Number.parseInt(this.route.snapshot.queryParamMap.get('id_serie'));
    this.verificarProfile();
    this.id_serie !== 0 ? this.cargarInputs() : '';
    this.episodeSelect.valueChanges.subscribe(item => this.saveEpisodes(Number.parseInt(item)));

    //Inicilizar variables
    this.flatEpisode = false;
    this.file_imgportada = "";
    this.url_local_imgportada = [];
    this.url_local_imgfotogramas = [];
    this.file_imgfotogramas = [];
    this.number_asoc_fotograma_edit = 0;
    this.array_deleteFotograma=[];
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
  verFotograma(numberFotograma){
    console.log('ver',numberFotograma);
  }
  async saveEpisodes(numberEp:number){
    let formData;
    //IF (NUEVO EPIZODIO) ELSE (EPISODIO EXISTENTE) 
    if (numberEp === 0 && this.id_serie !== 0){
      this.flatEpisode = false;
      formData = new FormData;
      formData.append('url','contenido');
      formData.append('params','POST');
      formData.append('data',JSON.stringify({"episodios":{id_serie:this.id_serie,number_episodio:this.episodes.length+1}}));
      let { response } = await this.comBackend.requestBackend(formData);
      if (response.episodios > 0) {
        this.episodes.push({id_episodio:response.episodios,id_serie:this.id_serie,number_episodio:this.episodes.length+1});
        this.episodeSelect.setValue(this.episodes.length-1,{onlySelf:true, emitEvent:false}); //Falto no
      } else {console.log('fallo', response.episodios)}
    } else if (numberEp !== 0) {
      this.flatEpisode = true;
      formData = new FormData;
      formData.append('url','contenido');
      formData.append('params','GET-EDIT-FOTO');
      formData.append('data',JSON.stringify({id_episodio:numberEp}));
      let { response } = await this.comBackend.requestBackend(formData);
      this.fotogramas = response.fotogramas;
      this.labelEpisode = this.episodes.find( episode => episode.id_episodio == numberEp).number_episodio;
      this.url_local_imgfotogramas = [];
      response.fotogramas.forEach((item)=>{
        this.url_local_imgfotogramas.push(item.imagen);
      });
    }
  }
  async saveChanges(){
    console.log("Antes: ",this.fotogramas);
    let data;
    if (this.id_serie === 0) {
      data = {
        "series":{titulo:this.title.value,descripcion:this.description.value},
        "id_user":this.id_user};
    } else if (this.id_serie !== 0) {
      data = {
        "series":{id_serie:this.id_serie,titulo:this.title.value,descripcion:this.description.value},
        "id_user":this.id_user};
      if (this.fotogramas.length>0) {
        data = {
          "series":{id_serie:this.id_serie,titulo:this.title.value,descripcion:this.description.value},
          "id_user":this.id_user,
          "fotogramas":this.fotogramas,
          "delete_fotograma[]":this.array_deleteFotograma};
      }
    }

    if (this.title.valid && this.description.valid && this.url_local_imgportada.length === 1) {
      let formData = new FormData;
      formData.append('url','contenido');
      formData.append('params','POST');
      formData.append('data',JSON.stringify(data));
      formData.append('file_imgportada',this.file_imgportada);
      if (this.file_imgfotogramas.length > 0) {
        for (let index = 0; index < this.file_imgfotogramas.length; index++) {
          formData.append(`file_imgfotogramas${this.file_imgfotogramas[index].number_fotograma_asoc}`, this.file_imgfotogramas[index].file);
        }
      }
      let { response } = await this.comBackend.requestBackend(formData);
      this.id_serie === 0 ? (response.series > 0 ? this.id_serie=response.series : '') : '';
      if (typeof response.fotogramas?.insert !== null){
        let item_Fotograma;
        response.fotogramas.insert.forEach(element => {
          item_Fotograma = this.fotogramas.find(item => item.number_fotograma==element.fotograma.number_fotograma);
          item_Fotograma.id_fotograma = element.id_fotograma;
        });
        //this.url_local_imgfotogramas = []; este no xq juega a mi favor
        this.file_imgfotogramas = []; // Puede que sea mas arriba
        this.array_deleteFotograma = []; // Puede que sea mas arriba
        console.log("Despues: ",this.fotogramas, "extra: ", this.url_local_imgfotogramas.length);
      }
    } else { console.log('Todos los campos son obligatorios') }
    
  }
  async onFileChange(event) {  
    if (event.target.files.length > 0) {
      this.file_imgportada = event.target.files[0]; //Es necesario ya que es el que se sube
      this.url_local_imgportada = await this.getFileInfo(event.target);
    }
    let input = <HTMLInputElement> document.getElementById("file");
    input.value = ""; 
  }
  async onFilesChange(event) {
    if (event.target.files.length > 0) {
      await this.getFileInfo(event.target,true); // adentro se le asigna a url_local_imgfotogramas
      for (let index = 0; index < event.target.files.length; index++) {
        this.file_imgfotogramas.push({"file":event.target.files[index],"number_fotograma_asoc":this.fotogramas.length+1});
        this.fotogramas.push({
          id_episodio:this.episodeSelect.value,number_fotograma:this.fotogramas.length+1})
      }
    }
    let input = <HTMLInputElement> document.getElementById("files");
    input.value = ""; 
  }
  async onFilesOneChange(event){
    if (event.target.files.length > 0) {
      let aux =  this.file_imgfotogramas.find(item => item.number_fotograma_asoc == this.number_asoc_fotograma_edit);
      if (aux !== undefined){
        aux.file = event.target.files[0];
      } else {
        this.file_imgfotogramas.push({file:event.target.files[0],number_fotograma_asoc:this.number_asoc_fotograma_edit});
      }
      this.url_local_imgfotogramas[this.number_asoc_fotograma_edit-1] = await this.getFileInfo(event.target);
    }
    let input = <HTMLInputElement> document.getElementById("filesOne");
    input.value = ""; 
  }
  editFotograma(card){
    this.number_asoc_fotograma_edit = card.number_fotograma;console.log("edit: ",this.number_asoc_fotograma_edit);
  }
  deleteFotograma(card){
    console.log("Antes: ", this.fotogramas);
    let aux = this.file_imgfotogramas.find(item => item.number_fotograma_asoc == card.number_fotograma);
    if (aux !== undefined){
      this.file_imgfotogramas.splice(card.number_fotograma-1,1);
    } else {
      this.array_deleteFotograma.push({id_fotograma:card.id_fotograma, id_episodio: Number.parseInt(this.episodeSelect.value)});
    }
    this.fotogramas.splice(card.number_fotograma-1,1);
    this.url_local_imgfotogramas.splice(card.number_fotograma-1,1);console.log("Despues: ", this.fotogramas);
  }

  async cargarInputs(){
    let formData = new FormData;
    formData.append('url','contenido');
    formData.append('params','GET-EDIT-INIT');
    formData.append('data',JSON.stringify({id_serie:this.id_serie}));
    let { response } = await this.comBackend.requestBackend(formData);

    this.title.setValue(response.series[0].titulo);
    this.description.setValue(response.series[0].descripcion);
    this.url_local_imgportada = [response.series[0].imgportada];

    this.episodes = response.episodios;

  }
  async getFileInfo(archivos,mal?):Promise<Array<any>> {
    return new Promise(resolve =>{
      let ref = this;
      var fileInput = archivos; //<HTMLInputElement> document.getElementById("fileInput");
      var archivoRuta = fileInput.value;
      var extPermitidas = /(.PNG|.png|.jpg|.JPG|.JPEG|.jpeg)$/i;
      var array_fotos = [];
      var array = [];
      var message = "";
      if ('files' in fileInput) {
          if (fileInput.files.length == 0 || !extPermitidas.exec(archivoRuta)) {
              message = "Por favor eliga uno o más archivos.";
              if (!extPermitidas.exec(archivoRuta)) {
                  message = "Por favor, asegurese de que eliga una imagen";
              }
          } else {
              if (fileInput.files.length ) {
                
                for (let i=0; i < fileInput.files.length;i++) {
                  /*
                  let visor = new FileReader();
                  visor.onloadend = function(e) {
                    return new Promise(resolve => {
                    array_fotos.push(e.target.result);
                    resolve(array.push(visor.result));});
                  };
                  visor.readAsDataURL(fileInput.files[i]);
                  */
                  
                  var promise = getBase64(fileInput.files[i]);
                  promise.then(function(result) {
                    array_fotos.push(result);
                    typeof mal === 'boolean' ? ref.url_local_imgfotogramas.push(result) : '';
                  });
                }
              }
              for (var i = 0; i < fileInput.files.length; i++) {
                  message += (i + 1) + ". file";
                  var file = fileInput.files[i];
                  if ('name' in file) {
                      message += "Nombre: " + file.name;
                  }
                  if ('size' in file) {
                      message += "Tamaño: " + file.size + " bytes";
                  }
              }
          }
      } else {
          if (archivoRuta == "") {
              message += "Selecciona una o más imagenes.";
              message += "Use el control o shift para seleccionar varias imagenes";
          } else {
              message += "Tu navegador no soporta el programa";
              message += "Fila seleccionada " + archivoRuta;
          }
      }
      function getBase64(file) {
        return new Promise(function(resolve, reject) {
            var reader = new FileReader();
            reader.onload = function() { resolve(reader.result); };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
      }
      //console.log("Salida resolve: ",array_fotos, "Length ",array , array.length);
      resolve(array_fotos);

    });
  }

}
