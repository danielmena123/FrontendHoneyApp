import { EventEmitter, Injectable } from '@angular/core';
import { HubConnectionBuilder, HubConnection } from '@aspnet/signalr';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { Mensajes } from '../models/mensajes';
import { SecurityService } from './security.service';
import { Chats } from '../models/chats';

@Injectable({
  providedIn: 'root'
})
export class SignalrcustomService {

  private apiURL = environment.apiURL;
  emitirMensaje: EventEmitter<Mensajes> = new EventEmitter();
  emitirChat: EventEmitter<Chats> = new EventEmitter();
  notifyNewPub: EventEmitter<boolean> = new EventEmitter();
  connectionEstablished = new EventEmitter<boolean>();
  // public hubConnection : HubConnection;
  public hubConnection : signalR.HubConnection
  private connectionIsEstablished = false;

  constructor(private securityService: SecurityService) {
    this.startConnection();    
   }
    public startConnection = () => {
      const token = this.securityService.GetToken();
      this.hubConnection = new signalR.HubConnectionBuilder()
                          .withUrl(`${this.apiURL}/signalr`, { accessTokenFactory: () => token })
                          .build();
      this.hubConnection.start()
                        .then(() => {
                          this.connectionIsEstablished = true;
                          console.log('Connection started') 
                          this.connectionEstablished.emit(true);
                        })
                        .catch(err => console.log('Error while starting connection: ' + err))      
    }

  RecieveMessage(): void {
    this.hubConnection.on('sendMessage', (mensaje) => {
      let message: Mensajes = JSON.parse(mensaje);
      this.emitirMensaje.emit(message);
    })
  }
  
  AddToGroup(groupId: string){
    this.hubConnection.invoke("AddToGroup", groupId);
  }

  NewPublicacion(){
    this.hubConnection.invoke("NewPublicacion");
  }

}
// this.hubConnection.on('sendChat', (mensaje) => {
//   let chat: Chats = JSON.parse(mensaje);
//   this.emitirChat.emit(chat);
// });