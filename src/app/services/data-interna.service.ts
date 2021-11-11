import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataInternaService {

  profile:{user:string};

  constructor() { }

  getProfile():{user:string}{
    return this.profile;
  }
  setProfile(data:{user:string}){
    this.profile = data;
  }
}
