import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  constructor() { }

  $refrescarMensajes = new EventEmitter<any>();
}
