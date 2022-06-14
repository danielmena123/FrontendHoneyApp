import { EventEmitter, Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ModalesService {

  constructor() { }

  $modal = new EventEmitter<any>();
  $refres = new EventEmitter<any>();
  $modalList = new EventEmitter<any>();
  $refreshChats = new EventEmitter<any>();
}
