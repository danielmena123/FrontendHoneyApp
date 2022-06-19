import { Injectable } from '@angular/core';
import { UsuarioAccess } from '../models/access';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storage: any;

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
      let usuario: UsuarioAccess = {
        usuariosId: parseFloat(JSON.parse(window.atob(data.split('.')[1]))["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]),
        nombreUsuario: JSON.parse(window.atob(data.split('.')[1]))["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]        
      }
      return usuario;
    }

    return;
  }

}
