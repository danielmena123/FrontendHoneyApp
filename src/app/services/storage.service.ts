import { Injectable } from '@angular/core';
import { UsuarioAccess } from '../models/access';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storage: any;

  token: any

  constructor() { 
    this.storage = sessionStorage;
  }

  public retrieve(key: string): any{
    const item = this.storage.getItem(key);

    if (item && item !== 'undefined') {
      return JSON.parse(item);
    }

    return;
  }

  public store(key: string, value: any){
    this.storage.setItem(key, JSON.stringify(value));
  }

  public retieveUser(key: string): any{
    var data = sessionStorage.getItem('authData');
    if(data != null){
      this.token =  jwt_decode(data)
      try {
        let usuario: UsuarioAccess = {
          usuariosId: this.token["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
          nombreUsuario: this.token["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
          img: this.token['http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata'],    
        }

        return usuario;
      } catch (error) {
        console.log('----------------------------------------------------errrorrr----------------------------')
        console.log(error)
      }
      
    }

    return;
  }

}
