import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UsuarioAccess } from 'src/app/models/access';
import { Chats } from 'src/app/models/chats';
import { ChatsService } from 'src/app/services/chats.service';
import { DataService } from 'src/app/services/data.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { SecurityService } from 'src/app/services/security.service';
import { SignalrcustomService } from 'src/app/services/signalrcustom.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-listado-chats',
  templateUrl: './listado-chats.component.html',
  styleUrls: ['./listado-chats.component.css']
})
export class ListadoChatsComponent implements OnInit {

  @Output() openMessage = new EventEmitter<boolean>();

  private apiURL = environment.apiURL;

  //Datos a cargar
  usuario!: UsuarioAccess;
  chats!: Chats[];

  constructor(
    private chatService: ChatsService, 
    private notificacionesService: NotificacionesService,
    private signalr: SignalrcustomService,
    private dataService: DataService,
    private securityServices: SecurityService
    ) { }

  ngOnInit(): void {

    //Cargar Datos
    this.CargarUsuario();
    this.CargarDatos();

    this.signalr.emitirMensaje.subscribe(res => {
      if(res != null && res.usuariosId != this.usuario.usuariosId){
        this.CargarDatos();
      }
    });
    this.chatService.$refrescarChats.subscribe(res => {
      if(res){
        this.CargarDatos();
      }
    });
  }

  CargarDatos(){
    const url = `${this.apiURL}/Chats/${this.usuario.usuariosId}`;
    this.dataService.get<Chats[]>(url).subscribe( res => {
      this.chats = res.body!;
      this.chats.forEach(element => {
        const result =  new Date(Date.now()).getTime() - new Date(element.lastFecha).getTime();
        if ((result/(1000*60*60)) < 24)
        {
          element.shortime = true;
        }
        else{
          element.shortime = false;
        }
      });
    })
  }

  CargarUsuario(){
    var data = this.securityServices.GetUser();
    this.usuario = data;
  }

  //Funcion Abrir Componente Mensaje
  openMensajes(ChatId: number, secondUserName: string){    
    this.openMessage.emit(true)
    //Construir data a enviar
    const data = {
      ChatId: ChatId,
      secondUserName: secondUserName
    }

    let anything: any;
    const url = `${this.apiURL}/Mensajes/${ChatId}/${this.usuario.usuariosId}`;
    this.dataService.Put<any>(url, anything).subscribe(res => {
      this.chatService.$changeChat.emit(data);    
      this.notificacionesService.$refrescarMensajes.emit(true);
      this.CargarDatos();
    });    
  }

}
