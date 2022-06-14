import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UsuarioAccess } from '../models/access';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  IsAuthorized: any;
  private authSource = new Subject<boolean>();
  authChallenge$ = this.authSource.asObservable();

  constructor(private storeService: StorageService) { 
    if(this.storeService.retrieve('IsAuthorized') !== ''){
      this.IsAuthorized = this.storeService.retrieve('IsAuthorized');
      this.authSource.next(true);
    }
  }

  public GetToken(): any {
    return this.storeService.retrieve('authData');
  }

  public GetUser(): any {
    return this.storeService.retrieve('usuario');
  }

  public ResetAuthData(){
    this.storeService.store('authData', '');
    this.IsAuthorized = false;
    this.storeService.store('IsAuthorized', false);
    this.storeService.store('usuario', '');
  }

  public SetAuthData(token: any, usuario: any){      
    this.storeService.store('authData', token);
    this.IsAuthorized = true;
    this.storeService.store('IsAuthorized', true);
    this.storeService.store('usuario', usuario);

    this.authSource.next(true);
  }

  public LogOff(){
    this.ResetAuthData();
    this.authSource.next(true);
  }

}
