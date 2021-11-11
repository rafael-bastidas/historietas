import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConnectionBackendService } from '../services/connection-backend.service';

@Component({
  selector: 'app-init-session',
  templateUrl: './init-session.page.html',
  styleUrls: ['./init-session.page.scss'],
})
export class InitSessionPage implements OnInit {

  usuario:FormControl = new FormControl('', Validators.required);
  contrasena:FormControl = new FormControl('', Validators.required);
  userActivo;

  constructor(private comBackend:ConnectionBackendService, private router:Router) { }

  ngOnInit() {
    this.userActivo = localStorage.getItem('user');
  }
  async ingresar(){
    let formData = new FormData;
    formData.append('url','contenido');
    formData.append('params','AUTENTICAR');
    formData.append('data',JSON.stringify({nickname:this.usuario.value,password:this.contrasena.value}));
    let { response } = await this.comBackend.requestBackend(formData);
    if (response > 0){
      localStorage.setItem("user",this.usuario.value);
      this.router.navigate(['/'],{queryParams:{id:1}});
    } else {
      console.log('Usuario no registrado');
    }
  }
  async registrar(){
    let formData = new FormData;
    formData.append('url','contenido');
    formData.append('params','REGISTRAR');
    formData.append('data',JSON.stringify({nickname:this.usuario.value,password:this.contrasena.value}));
    let { response } = await this.comBackend.requestBackend(formData);
    if (response){
      localStorage.setItem("user",this.usuario.value);
      this.router.navigate(['/'],{queryParams:{id:1}});
    } else {
      console.log('Fallo registrando');
    }
  }
  cerrarSession(){
    localStorage.removeItem('user');
    this.router.navigate(['/'],{queryParams:{id:1}});
  }

}
