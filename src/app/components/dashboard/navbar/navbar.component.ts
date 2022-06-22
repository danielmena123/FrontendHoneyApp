import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioAccess } from 'src/app/models/access';
import { Chats, Salas } from 'src/app/models/chats';
import { Notificaciones } from 'src/app/models/Notificaciones';
import { ChatsService } from 'src/app/services/chats.service';
import { DataService } from 'src/app/services/data.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { PublicacionesService } from 'src/app/services/publicaciones.service';
import { SecurityService } from 'src/app/services/security.service';
import { SignalrcustomService } from 'src/app/services/signalrcustom.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  private apiURL = environment.apiURL;

  //Variable de Datos
  usuario!: UsuarioAccess;
  //Variable de Notificaciones
  hidden: boolean = true;
  newNotify: boolean = false;
  //Variable de notificaciones personalizadas
  newNotifyPer: boolean = false;

  //notificacion numero  de mensajes
  messageRead: number = 0;

  constructor(
    private securityServices: SecurityService, 
    private router: Router,
    private signalr: SignalrcustomService,
    private chatService: ChatsService,
    private notificacionesService: NotificacionesService,
    private dataservice: DataService,
    ) {
     }

  ngOnInit(): void {    
    this.signalr.RecieveNotificacion();
    this.signalr.RecieveMessage();
    this.CargarUsuario();
    this.CargarNotifiaciones();
    this.signalr.notifyNewPub.subscribe(res => {
      if(res == true){
        this.newNotify = true;
      }
    });
    this.signalr.connectionEstablished.subscribe(res => {
      if(res == true){
        this.CargarRooms();   
      }
    });    
    this.notificacionesService.$refrescarMensajes.subscribe(res => {
      if(res == true){
        this.CargarNotifiaciones();
      }
    });    
    this.chatService.$refrescarRooms.subscribe(res => {
      if(res == true){
        this.CargarRooms();
        this.CargarNotifiaciones();
      }
    });
  }

  //Cargar Usuario
  CargarUsuario(){
    var data = this.securityServices.GetUser();
    this.usuario = data;
  }

  //Cargar Salas
  CargarRooms(){
    const url = `${this.apiURL}/Chats/Salas/${this.usuario.usuariosId}`;
    this.dataservice.get<Salas[]>(url).subscribe(res => {
      res.body!.forEach(item => {
        this.signalr.hubConnection.invoke("AddToGroup", item.rooms);
      });
    })
  }

  //Cargar Notificaciones
  CargarNotifiaciones(){
    const url = `${this.apiURL}/Notificaciones/Mensajes/${this.usuario.usuariosId}`
    this.dataservice.get<Notificaciones>(url).subscribe(res => {
      this.messageRead = res.body!.mensajesnoleidos;
      if(this.messageRead > 0){
        this.hidden = false;
      }
      else{
        this.hidden = true;
      }
    })
  }

  logout(){
    this.securityServices.LogOff();
    this.router.navigate(["/logout"]);
  }

}
