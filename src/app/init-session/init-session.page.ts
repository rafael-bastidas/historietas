import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConnectionBackendService } from '../services/connection-backend.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-init-session',
  templateUrl: './init-session.page.html',
  styleUrls: ['./init-session.page.scss'],
})
export class InitSessionPage implements OnInit {

  usuario:FormControl = new FormControl('', Validators.required);
  contrasena:FormControl = new FormControl('', Validators.required);
  userActivo;

  constructor(private comBackend:ConnectionBackendService, private router:Router,
    public toastController: ToastController) { }

  ngOnInit() {
    
  }
  ionViewWillEnter(){
    this.userActivo = localStorage.getItem('user');
  }
  async ingresar(){
    let formData = new FormData;
    formData.append('url','contenido');
    formData.append('params','AUTENTICAR');
    formData.append('data',JSON.stringify({nickname:this.usuario.value,password:this.contrasena.value}));
    let { response } = await this.comBackend.requestBackend(formData);
    if (response[0].id_users > 0){
      localStorage.setItem("user",this.usuario.value);
      localStorage.setItem("id_user",response[0].id_users);
      this.router.navigate(['/'],{queryParams:{id:1}});
    } else if (response[0].id_users == -1) {
      this.presentToast('Usuario no registrado', 2000);
    } else {
      this.presentToast('Error de red', 3000);
    }
  }
  async registrar(){
    let formData = new FormData;
    formData.append('url','contenido');
    formData.append('params','REGISTRAR');
    formData.append('data',JSON.stringify({nickname:this.usuario.value,password:this.contrasena.value}));
    let { response } = await this.comBackend.requestBackend(formData);
    if (response > 0){
      localStorage.setItem("user",this.usuario.value);
      localStorage.setItem("id_user",response);
      this.router.navigate(['/']);
    } else if (response == -1){
      this.presentToast('Usuario registrado', 2000);
    } else {
      this.presentToast('Fallo de red', 2000);
    }
  }
  cerrarSession(){
    localStorage.removeItem('user');
    localStorage.removeItem('id_user');
    this.router.navigate(['/']);
  }
  async presentToast(message, duration) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration
    });
    toast.present();
  }

}
