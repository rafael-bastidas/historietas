import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConnectionBackendService {

  URL_API: string;

  constructor() {
    this.URL_API = "https://rafaelbastidas.com/apis/api-historieta/app.php";
  }

  async requestBackend(data){
    try {
      const response = await fetch(this.URL_API, {
        headers: {'KEY_HIST': 'Z9AQBQXUWDHRN5GYE3DUG52BTSFT1NMA', 'Access-Control-Allow-Origin' : '*'},
        method: 'POST',
        body: data
      });
      const res_data = await response.json();
      console.log("Response of backend", res_data);
      return res_data;
    } catch (error) {
      console.log("Error de conexion", error);
      return {response: null};
    }
  }

}
