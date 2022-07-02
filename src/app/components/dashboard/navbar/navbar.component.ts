import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioAccess } from 'src/app/models/access';
import { Notificaciones, NotificacionesNoLeidas } from 'src/app/models/Notificaciones';
import { Salas } from 'src/app/models/Salas';
import { ChatsService } from 'src/app/services/chats.service';
import { DataService } from 'src/app/services/data.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { SecurityService } from 'src/app/services/security.service';
import { SignalrcustomService } from 'src/app/services/signalrcustom.service';
import { environment } from 'src/environments/environment';

import {MatMenuTrigger} from '@angular/material/menu';
import {MatDialog} from '@angular/material/dialog';
import { NotificacionesComponent } from '../notificaciones/notificaciones.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;

  private apiURL = environment.apiURL;
  mostrarNotificacion: boolean= false

  //Variable de Datos
  usuario!: UsuarioAccess;
  //Variable de Notificaciones
  hidden: boolean = true;
  newPublication: boolean = true;
  //Variable de notificaciones personalizadas
  newNotifyPer: boolean = true;

  //notificacion numero  de mensajes
  messageRead: number = 0;
  //notificacion numero de notificaciones e icono
  notificationRead: number = 0;
  icono: string = "notifications";

  constructor(
    private securityServices: SecurityService, 
    private router: Router,
    private signalr: SignalrcustomService,
    private chatService: ChatsService,
    private notificacionesService: NotificacionesService,
    private dataservice: DataService,
    public dialog: MatDialog
    ) {
     }

  ngOnInit(): void {    
    this.signalr.RecieveNotificacion();
    this.signalr.RecieveMessage();
    this.signalr.NotifyPublicacion();
    this.signalr.Notificaciones();
    this.CargarUsuario();
    this.CargarNotificaciones();
    this.signalr.notifyNewPub.subscribe(res => {
      if(res == true){
        this.newPublication = false;
      }
    });
    this.signalr.connectionEstablished.subscribe(res => {
      if(res == true){
        this.CargarRooms();   
      }
    });    
    this.notificacionesService.$refrescarMensajes.subscribe(res => {
      if(res == true){
        this.CargarNotificaciones();
      }
    });    
    this.chatService.$refrescarRooms.subscribe(res => {
      if(res == true){
        this.CargarRooms();
        this.CargarNotificaciones();
      }
    });
    this.signalr.notificaciones.subscribe(res => {
      if(res == true){
        this.CargarNotificaciones();
      }
    })

         
    this.notificacionesService.$MostrarNotificaciones.subscribe(res => {
      if(res == true && this.mostrarNotificacion == false){
        this.mostrarNotificacion = true;
        console.log(this.mostrarNotificacion)
      }else {
        this.mostrarNotificacion = false;
      }
    })
  }

  openDialog() {
    
     let dialogRef =  this.dialog.open(NotificacionesComponent);

  }

  //Cargar Usuario
  CargarUsuario(){
    var data = this.securityServices.GetUser();
    this.usuario = data;
  }

  //Cargar Salas
  CargarRooms(){
    const url = `${this.apiURL}/Salas/${this.usuario.usuariosId}`;
    this.dataservice.get<Salas[]>(url).subscribe(res => {
      res.body!.forEach(item => {
        this.signalr.hubConnection.invoke("AddToGroup", item.rooms);
      });
    });
    const urlPublicaciones = `${this.apiURL}/Salas/Publicaciones/${this.usuario.usuariosId}`;
    this.dataservice.get<Salas[]>(urlPublicaciones).subscribe(res => {
      res.body!.forEach(item => {
        this.signalr.hubConnection.invoke("AddToGroup", item.rooms);
      });
    });
    const urlComentarios = `${this.apiURL}/Salas/Comentarios/${this.usuario.usuariosId}`;
    this.dataservice.get<Salas[]>(urlComentarios).subscribe(res => {
      res.body!.forEach(item => {
        this.signalr.hubConnection.invoke("AddToGroup", item.rooms);
      });
    });
    const urlRespuestas = `${this.apiURL}/Salas/Respuestas/${this.usuario.usuariosId}`;
    this.dataservice.get<Salas[]>(urlRespuestas).subscribe(res => {
      res.body!.forEach(item => {
        this.signalr.hubConnection.invoke("AddToGroup", item.rooms);
      });
    })
  }

  //Cargar Notificaciones
  CargarNotificaciones(){
    const url = `${this.apiURL}/Notificaciones/Mensajes/${this.usuario.usuariosId}`;
    this.dataservice.get<Notificaciones>(url).subscribe(res => {
      this.messageRead = res.body!.mensajesnoleidos;
      if(this.messageRead > 0){
        this.hidden = false;
      }
      else{
        this.hidden = true;
      }
    });
    const urlNoti = `${this.apiURL}/Notificaciones/NoLeidos/${this.usuario.usuariosId}`;
    this.dataservice.get<NotificacionesNoLeidas>(urlNoti).subscribe(res => {
      this.notificationRead = res.body!.notificacionnoleidas;
      if(this.notificationRead > 0){
        this.newNotifyPer = false;
        this.icono = "notifications_active";
      }
      else{
        this.newNotifyPer = true;
      }
    });
  }

  CargarPublicaciones(){
    this.notificacionesService.$CargarPublicaciones.emit(true);
    this.newPublication = true;
  }

  logout(){
    this.securityServices.LogOff();
    this.router.navigate(["/logout"]);
    this.signalr.CloseConnection();
  }

  RefrescarNotificaciones(){
    this.notificacionesService.$refrescarNotificaciones.emit(true);
  }

  mostrarNotificaciones(){
    this.notificacionesService.$MostrarNotificaciones.emit(true);
  }
}
