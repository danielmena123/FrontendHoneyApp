import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioAccess } from 'src/app/models/access';
import { Chats, Chat_Detalle_C } from 'src/app/models/chats';
import { Mensajes, Mensajes_C } from 'src/app/models/mensajes';
import { ChatsService } from 'src/app/services/chats.service';
import { DataService } from 'src/app/services/data.service';
import { ModalesService } from 'src/app/services/modales.service';
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
    private Chat: ChatsService, 
    private modal: ModalesService,
    private signalr: SignalrcustomService,
    private dataService: DataService,
    private securityServices: SecurityService
    ) { 
    this.mensajeForm = this._builder.group({
      Descripcion: ['', Validators.required]
    })
  }

  ngOnInit(): void {

    //Carga de Funciones Principales
    this.signalr.RecieveMessage();
    this.CargarUsuario();    
    this.CargarDatos(); 

    //Subscricion a la funcion del modal
    this.Chat.$newChat.subscribe(data => {
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
    this.Chat.$changeChat.subscribe(data => {
      if(data != null){
        this.chatId = data.ChatId;
        this.secondnombreUsuario = data.secondUserName;
        this.mostrar = true;
        this.newChat = false;
        this.CargarDatos();
      }
    })

    //Subscripcion a respuesta de Signalr
    this.signalr.emitirMensaje.subscribe((data) => {
      this.chatId = data.chatsId;
      data.shortime = true;
      this.newChat = false;
      this.CargarDatos();
      this.Mensajes.push(data);
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
    const url = `${this.apiURL}/Mensaje/${this.chatId}`;
    this.dataService.get<Mensajes[]>(url).subscribe( res => {
      this.Mensajes = res.body!;
      this.Mensajes.forEach(element => {
        const result =  new Date(Date.now()).getTime() - new Date(element.fecha).getTime();
        if ((result/(1000*60*60)) < 24)
        {
          element.shortime = true;
        }
        else{
          element.shortime = false;
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
        usuarioPrimario: this.usuario.usuariosId,
        usuarioSecundario: this.secondusurioId,
        nombreUsuario: this.secondnombreUsuario
      }

      //Agrego el nuevo Chat
      const url_dt = `${this.apiURL}/Chat`;
      this.dataService.Post<Chats>(url_dt, this.chatDetalle).subscribe(res => {
        //Agregar Id del Chat Ingresado
        this.chats = res.body!; 
        this.mensaje.chatsId = this.chats.chatsId;

        //Agregar al grupo del chat
        var group = "Chat" + this.chats.chatsId;
        this.signalr.AddToGroup(group);

        //Guardar msj modificado
        const url_msg = `${this.apiURL}/Mensaje`;
        this.dataService.Post<Mensajes_C>(url_msg, this.mensaje).subscribe( res => {

          //construir chat a listar
          // const data =  {
          //   switch: true,
          //   nombre: res.body!.nombreUsuario,
          //   id: this.mensaje.chatsId
          // }

          //enviar datos por la funcion de refrescar
          this.modal.$refreshChats.emit(true);

          //resetear textarea
          this.mensajeForm.reset();
        }, err => {
          console.log(err);
        })
      })
   }
   else{
    const url_msg = `${this.apiURL}/Mensaje`;
    this.dataService.Post<Mensajes_C>(url_msg, this.mensaje).subscribe( res => {

      //construir chat a listar
      // const data = {
      //   switch: true,
      //   nombre: this.nombreUsuario,
      //   id: this.mensaje.chatsId
      // }

      //enviar datos por la funcion de refrescar
      this.modal.$refreshChats.emit(true);

      //resetear textarea
      this.mensajeForm.reset();
    }, err => {
      console.log(err);
    })
   }
  }

}
