import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComentariosService {

  $modal = new EventEmitter<any>();

  constructor() { }
}
