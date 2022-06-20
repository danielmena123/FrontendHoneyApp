import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {

  $refreshPubli = new EventEmitter<any>();  
  $modal = new EventEmitter<any>();

  constructor() { }
}
