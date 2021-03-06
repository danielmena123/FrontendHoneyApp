import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  constructor() { }

  $newChat = new EventEmitter<any>();
  $changeChat = new EventEmitter<any>();
  $refrescarChats = new EventEmitter<any>();
  $refrescarRooms = new EventEmitter<any>();

}
