import { Component, OnInit } from '@angular/core';
import { UsuarioAccess } from 'src/app/models/access';
import { Chats } from 'src/app/models/chats';
import { ChatsService } from 'src/app/services/chats.service';
import { DataService } from 'src/app/services/data.service';
import { ModalesService } from 'src/app/services/modales.service';
import { SecurityService } from 'src/app/services/security.service';
import { SignalrcustomService } from 'src/app/services/signalrcustom.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-listado-chats',
  templateUrl: './listado-chats.component.html',
  styleUrls: ['./listado-chats.component.css']
})
export class ListadoChatsComponent implements OnInit {

  private apiURL = environment.apiURL;

  //Datos a cargar
  usuario!: UsuarioAccess;
  chats!: Chats[];

  constructor(
    private service: ChatsService, 
    private modal: ModalesService, 
    private signalr: SignalrcustomService,
    private dataService: DataService,
    private securityServices: SecurityService
    ) { }

  ngOnInit(): void {

    //Cargar Datos
    this.CargarUsuario();
    this.CargarDatos();

    //Subscribirse a la funcion del modal
    this.modal.$refreshChats.subscribe(data => {
      if(data == true){
        this.ngOnInit();
      }
    });
    // Subscribir a signlar
    // this.signalr.emitirChat.subscribe(data => {
    //   console.log(data);
    //   data.shortime = true;
    //   this.chats.push(data);
    // })
  }

  CargarDatos(){
    const url = `${this.apiURL}/Chat/${this.usuario.usuariosId}`;
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

    //Agregar a grupo signalr
    var group = "Chat" + ChatId;
    this.signalr.AddToGroup(group);

    //Construir data a enviar
    const data = {
      ChatId: ChatId,
      secondUserName: secondUserName
    }

    this.service.$changeChat.emit(data);    
  }

}
