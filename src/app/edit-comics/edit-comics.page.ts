import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConnectionBackendService } from '../services/connection-backend.service';

@Component({
  selector: 'app-edit-comics',
  templateUrl: './edit-comics.page.html',
  styleUrls: ['./edit-comics.page.scss'],
})
export class EditComicsPage implements OnInit {

  //{id_episodio:number,id_serie:number,number_episodio:number}
  episodes:Array<{value:number,label:string}> = [{value:0,label:'Nuevo episodio'}];
  fotogramas:Array<any> = [];
  title:FormControl = new FormControl('');
  description:FormControl = new FormControl('');
  episodeSelect:FormControl = new FormControl('');
  flatEpisode:boolean = false;

  file_imgportada = "";
  file_imgfotogramas = "";

  id_serieBackend = null;

  constructor(private comBackend:ConnectionBackendService, private route:ActivatedRoute) { }

  ngOnInit() {
    if (this.param_id_serie !== null){
      this.cargarInputs();
    }
    this.episodeSelect.valueChanges.subscribe(item => this.saveEpisodes(item));
  }
  verFotograma(numberFotograma){
    console.log('ver',numberFotograma);
  }
  async saveEpisodes(numberEp){
    let formData;
    if (numberEp === 0 && this.param_id_serie !== null){
      this.flatEpisode = true;
      formData = new FormData;
      formData.append('url','contenido');
      formData.append('params','POST');
      formData.append('data',JSON.stringify({"episodios":{"id_serie":Number.parseInt(this.param_id_serie),"number_episodio":this.episodes.length+1}}));
      let { response } = await this.comBackend.requestBackend(formData);
      if (response.episodios > 0) {
        this.episodes.push({value:this.episodes.length,label:`Episodio ${this.episodes.length}`});
        this.episodeSelect.setValue(this.episodes.length-1);
      } else {console.log('fallo')}
    } else if (numberEp !== 0) {
      this.flatEpisode = true;
      formData = new FormData;
      formData.append('url','contenido');
      formData.append('params','GET-EDIT-FOTO');
      formData.append('data',JSON.stringify({id_episodio:numberEp}));
      let { response } = await this.comBackend.requestBackend(formData);
      for (let index = 0; index < response.fotogramas.length; index++) {
        const fotograma = response.fotogramas[index];
        this.fotogramas.push({id:fotograma.id_fotograma,title:`#${fotograma.number_fotograma}`,url:fotograma.imagen});
      }
    }
  }
  async saveChanges(){
    
    let data;
    if (this.param_id_serie === null){
      data = {"series":{"titulo":this.title.value,"descripcion":this.description.value}};
    } else {
      data = {"series":{id_serie:this.param_id_serie,"titulo":this.title.value,"descripcion":this.description.value}};
    }
    let formData = new FormData;
    formData.append('url','contenido');
    formData.append('params','POST');
    formData.append('data',JSON.stringify(data));
    formData.append('file_imgportada',this.file_imgportada);
    let { response } = await this.comBackend.requestBackend(formData);
    this.param_id_serie === null ? (response.series > 0 ? this.id_serieBackend=response.series : '') : '';
    
  }
  onFileChange(event) {  
    if (event.target.files.length > 0) {
      this.file_imgportada = event.target.files[0];
    }
  }
  onFilesChange(event) {  
    if (event.target.files.length > 0) {
      this.file_imgfotogramas = event.target.files;
      console.log(this.file_imgfotogramas)
      for (let index = 0; index < this.file_imgfotogramas.length; index++) {
        const fotograma = this.file_imgfotogramas[index];
        //this.fotogramas.push({id:1,title:`#${this.fotogramas.length+1}`,url:'https://otakuteca.com/images/books/cover/5e3417c450a2b.jpg'});
        //Debo ir a backend y cargar los fotogrmas
      }
    }
  }
  async cargarInputs(){
    let formData = new FormData;
    formData.append('url','contenido');
    formData.append('params','GET-EDIT-INIT');
    formData.append('data',JSON.stringify({id_serie:this.param_id_serie}));
    let { response } = await this.comBackend.requestBackend(formData);
    this.title.setValue(response.series[0].titulo);
    this.description.setValue(response.series[0].descripcion);
    //Hay q agregar un img y configurarlo
    for (let index = 1; index <= response.episodios.length; index++) {
      this.episodes.push({value:index,label:`Episodio ${index}`});
    }
  }

  get param_id_serie() { return this.id_serieBackend===null ? this.route.snapshot.queryParamMap.get('id_serie') : this.id_serieBackend }
  get param_id_user() { return this.route.snapshot.queryParamMap.get('id_user') }
}
