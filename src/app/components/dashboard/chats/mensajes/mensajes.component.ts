import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioAccess } from 'src/app/models/access';
import { Chats, Chat_Detalle_C } from 'src/app/models/chats';
import { Mensajes, Mensajes_C } from 'src/app/models/mensajes';
import { ChatsService } from 'src/app/services/chats.service';
import { DataService } from 'src/app/services/data.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { SecurityService } from 'src/app/services/security.service';
import { SignalrcustomService } from 'src/app/services/signalrcustom.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.css']
})
export class MensajesComponent implements OnInit {

  private apiURL = environment.apiURL;

  //Varaibles de UsuarioSecundario
  secondnombreUsuario: string;
  secondusurioId: number;

  //Variables de Chat
  chats: Chats;
  chatDetalle: Chat_Detalle_C;
  newChat: boolean;

  //Variables de Carga de Datos
  usuario: UsuarioAccess;
  Mensajes: Mensajes[];

  //Variables de switch
  mostrar: boolean

  //Variables de Insercion de Datos
  mensajeForm: FormGroup;
  mensaje: Mensajes_C;
  chatId: number = 0;

  //Elemento de Componente Padre
  @ViewChild("listaMensajes")
  mContainer!: ElementRef;

  constructor(
    private _builder: FormBuilder, 
    private chatService: ChatsService, 
    private signalr: SignalrcustomService,
    private notificacionesService: NotificacionesService,
    private dataService: DataService,
    private securityServices: SecurityService
    ) { 
    this.mensajeForm = this._builder.group({
      Descripcion: ['', Validators.required]
    })
  }

  ngOnInit(): void {

    //Carga de Funciones Principales
    this.CargarUsuario();    
    this.CargarDatos(); 

    //Subscricion a la funcion del modal
    this.chatService.$newChat.subscribe(data => {
      if(data != null){
        this.chatId = 0;
        this.secondusurioId = data.id;
        this.secondnombreUsuario = data.nombre;    
        this.mostrar = true;       
        this.newChat = true;
        this.CargarDatos();
      }
    });

    //Subscripcion a la funcion del listado
    this.chatService.$changeChat.subscribe(data => {
      if(data != null){
        this.chatId = data.ChatId;
        this.secondnombreUsuario = data.secondUserName;
        this.mostrar = true;
        this.newChat = false;
        this.CargarDatos();
      }
    });

    //Subscripcion a respuesta de Signalr
    this.signalr.emitirMensaje.subscribe((data) => {
      if (data.usuariosId != this.usuario.usuariosId) {
        this.chatId = data.chatsId;
        data.shortime = true;
        this.newChat = false;
        this.Mensajes.push(data);
        this.signalr.Rooms();
        this.notificacionesService.$refrescarMensajes.emit(true);        
      }      
    });      
  }

  ngAfterViewInit(){}

  ngAfterViewChecked(){
    if(this.mContainer != null){
      this.mContainer.nativeElement.scrollTop =
      this.mContainer.nativeElement.scrollHeight;
    }    
  }

  //Cargar Mensajes
  CargarDatos(){
    const url = `${this.apiURL}/Mensajes/${this.chatId}`;
    this.dataService.get<Mensajes[]>(url).subscribe( res => {
      this.Mensajes = res.body!;
      this.Mensajes.forEach(item => {
        const result =  new Date(Date.now()).getTime() - new Date(item.fecha).getTime();
        if ((result/(1000*60*60)) < 24)
        {
          item.shortime = true;
        }
        else{
          item.shortime = false;
        }
      })
    })
  }

  //Cargar Usuario Logeado
  CargarUsuario(){
    var data = this.securityServices.GetUser();
    this.usuario = data;
  }

  //Funcion Enviar
  enviarMensaje(){    
    //Construir Mensaje
    this.mensaje = {
      descripcion: this.mensajeForm.value.Descripcion,
      chatsId: this.chatId,
      usuariosId: this.usuario.usuariosId,
      nombreUsuario: this.usuario.nombreUsuario
    }

    if(this.newChat == true){
      //Construir Chat_Detalle
      this.chatDetalle = {
        titulo: "",
        usuarioPrimarioId: this.usuario.usuariosId,
        usuarioSecundarioId: this.secondusurioId,
        nombreUsuario: this.secondnombreUsuario
      }

      //Agrego el nuevo Chat
      const url_dt = `${this.apiURL}/Chats`;
      this.dataService.Post<Chats>(url_dt, this.chatDetalle).subscribe(res => {
        //Agregar Id del Chat Ingresado
        this.chats = res.body!; 
        this.mensaje.chatsId = this.chats.chatsId;

        //Agregar el chat a la variable global
        this.chatId = this.chats.chatsId

        //Agregar al grupo del chat
        var group = "Chat" + this.chats.chatsId;
        this.signalr.AddToGroup(group);

        //Guardar msj modificado
        const url_msg = `${this.apiURL}/Mensajes`;
        this.dataService.Post<Mensajes>(url_msg, this.mensaje).subscribe( res => {
          if(res.body != null){

            //agregar nuevo mensaje al listado
            res.body.shortime = true;
            this.Mensajes.push(res.body);

            //refrescar el listado de chat y las salas al ususario principal
            this.chatService.$refrescarChats.emit(true);            

            //refrescar las salas de los demas
            this.signalr.Rooms();
            
             //resetear textarea
            this.mensajeForm.reset();
            this.newChat = false;
          }
        }, err => {
          console.log(err);
        })
      })
   }
   else{
    const url_msg = `${this.apiURL}/Mensajes`;
    this.dataService.Post<Mensajes>(url_msg, this.mensaje).subscribe( res => {
      if(res.body){
        const newMessage: Mensajes = res.body
        let anything: any;
        const url_see1_msg = `${this.apiURL}/Mensajes/${res.body.chatsId}/${this.usuario.usuariosId}`;
        this.dataService.Put<any>(url_see1_msg, anything).subscribe(res => {
          //agregar nuevo mensaje al listado
          newMessage.shortime = true;        
          this.Mensajes.push(newMessage);

          //refrescar listado de chats
          this.chatService.$refrescarChats.emit(true);
          //resetear textarea
          this.mensajeForm.reset();
        })
        
      }
    }, err => {
      console.log(err);
    })
   }
  }

  Borrar(id:number){
    console.log(id);
    const url = `${this.apiURL}/Mensajes/${id}`;
    this.dataService.delete<any>(url).subscribe(res => {
      this.CargarDatos();
    },
    err => {
      console.log(err);
    })
  }

  Eliminar(){
    this.mostrar = false;
  }

  Responder(){

  }

}
