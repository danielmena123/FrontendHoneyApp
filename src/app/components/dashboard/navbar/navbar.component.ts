import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioAccess } from 'src/app/models/access';
import { Salas } from 'src/app/models/chats';
import { ChatsService } from 'src/app/services/chats.service';
import { DataService } from 'src/app/services/data.service';
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
  newNotify: boolean = false;
  //Variable de notificaciones personalizadas
  newNotifyPer: boolean = false;
  newNotifyMessag: boolean = false;

  constructor(
    private securityServices: SecurityService, 
    private router: Router,
    private signalr: SignalrcustomService,
    private chatService: ChatsService,
    private dataservice: DataService,
    private publicacionesService: PublicacionesService
    ) {
     }

  ngOnInit(): void {    
    this.signalr.RecieveMessage();
    this.CargarUsuario();
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
    this.signalr.emitirMensaje.subscribe(res => {
      if(res != null && res.usuariosId != this.usuario.usuariosId){
        this.newNotifyMessag = true;
      }
    });
    this.chatService.$changeChatNotify.subscribe(res => {
      if(res == false){
        this.newNotifyMessag = false;
      }
    })
  }

  //Cargar Usuario
  CargarUsuario(){
    var data = this.securityServices.GetUser();
    this.usuario = data;
  }

  CargarRooms(){
    const url = `${this.apiURL}/Salas/${this.usuario.usuariosId}`;
    this.dataservice.get<Salas[]>(url).subscribe(res => {
      res.body!.forEach(item => {
        this.signalr.hubConnection.invoke("AddToGroup", item.rooms);
      });
    })
  }

  logout(){
    this.securityServices.LogOff();
    this.router.navigate(["/logout"]);
  }

  notifyPubliFalse(){
    this.newNotify = false;    
    this.publicacionesService.$refreshPubli.emit(true);
  }

}
