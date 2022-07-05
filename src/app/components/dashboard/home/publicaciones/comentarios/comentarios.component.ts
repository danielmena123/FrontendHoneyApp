import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioAccess } from 'src/app/models/access';
import { Comentarios, Comentario_C } from 'src/app/models/comentarios';
import { likes, likes_C } from 'src/app/models/likes';
import { NotificacionesForo } from 'src/app/models/Notificaciones';
import { ComentariosService } from 'src/app/services/comentarios.service';
import { DataService } from 'src/app/services/data.service';
import { SecurityService } from 'src/app/services/security.service';
import { SignalrcustomService } from 'src/app/services/signalrcustom.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css']
})
export class ComentariosComponent implements OnInit {

  private apiURL = environment.apiURL;

  usuario!: UsuarioAccess;
  like!: likes_C; 
  modalSwitch: boolean = false;
  comentarios!: Comentarios[];
  commentForm!: FormGroup;
  comentario!: Comentario_C;
  comment: Comentarios;
  comentariosId: number;
  usuarioComentarioId: number;
  notificacion: NotificacionesForo;
  @ViewChild('div') div!: ElementRef;

  @Input() publicacionesId!: number;
  @Input() usuarioPublicacion: number;

  constructor(
    private _builder: FormBuilder, 
    private signalr: SignalrcustomService,
    private comentariosService: ComentariosService,
    private dataService: DataService,
    private securityServices: SecurityService
    ) {
    this.commentForm = this._builder.group({
      Descripcion: ['', Validators.required],
    })
   }

  ngOnInit(): void {
    this.CargarUsuario();
    this.CargarDatos();
    this.comentariosService.$modal.subscribe(res => {
      if(res == true){
        this.CargarDatos();
        this.modalSwitch = false;
      }
    })
  }

  CargarUsuario(){
    var data = this.securityServices.GetUser();
    this.usuario = data;
  }

  CargarDatos(){

    const url = `${this.apiURL}/Comentarios/${this.publicacionesId}/${this.usuario.usuariosId}`;
    this.dataService.get<Comentarios[]>(url).subscribe(res => {
      this.comentarios = res.body!;
      this.comentarios.forEach(item => {
        const result =  new Date(Date.now()).getTime() - new Date(item.fecha).getTime();
        if ((result/(1000*60*60)) < 24){
          item.shortime = true;
        }
        else{
          item.shortime = false;
        }
      })
    })
  }

  enviarComentario(){

    this.comentario = {
      descripcion: this.commentForm.value.Descripcion,
      publicacionesId: this.publicacionesId,
      usuariosId: this.usuario.usuariosId
    }

    const url = `${this.apiURL}/Comentarios/`;
    this.dataService.Post<Comentarios>(url, this.comentario).subscribe(res => {

      //Agregar al grupo
      var room = "Comentario" + res.body?.comentariosId;      
      this.signalr.hubConnection.invoke("AddToGroup", room);
      
      if(this.usuario.usuariosId != this.usuarioPublicacion){
        const urlNoti = `${this.apiURL}/Notificaciones`;

        this.notificacion = {
          descripcion: `comento tu Publicacion`,
          referenciaId: this.publicacionesId,
          tipo_NotificacionesId: 1,
          usuarioReceptorId: this.usuarioPublicacion,
          usuariosId: this.usuario.usuariosId
        }

        this.dataService.Post(urlNoti, this.notificacion).subscribe(res => {

        });
      }

      this.CargarDatos();
      this.commentForm.reset();
    },
    err => {
      console.log(err);
    })
  }

  openRespuestas(i:any, c: Comentarios, activo: boolean){
    if(!activo){
      this.comentariosId = c.comentariosId;
      this.usuarioComentarioId = c.usuariosId;
      this.comentarios.forEach(element => {
        element.activo = false;
      })
      this.comentarios[i].activo = true;
    }
    else{
      this.comentarios.forEach(element => {
        element.activo = false;
      })
    }
  }

  openModal(data: Comentarios){
    this.comment = data;
    this.modalSwitch = true;
  }

  Eliminar(id: number){
    const url = `${this.apiURL}/Comentarios/${id}`;
    this.dataService.delete(url).subscribe(res => {
      this.comentariosService.$modal.emit(true);
    })
  }

  addLike(comentarioId: number, index: number){
    this.like = {
      modelosId: comentarioId,
      usuariosId: this.usuario.usuariosId
    }

    const url = `${this.apiURL}/Likes/Comentarios`;
    this.dataService.Post<likes>(url, this.like).subscribe(res => {
      if(res.body != null){
        this.comentarios[index].numLikes = res.body.numlikes

        if(this.usuario.usuariosId != this.comentarios[index].usuariosId){
          const urlNoti = `${this.apiURL}/Notificaciones/Likes`;
          this.notificacion = {
            descripcion: `A ${this.usuario.nombreUsuario} le gusto tu Comentario`,
            referenciaId: this.comentarios[index].comentariosId,
            tipo_NotificacionesId: 5,
            usuarioReceptorId: this.comentarios[index].usuariosId,
            usuariosId: this.usuario.usuariosId
          }

          this.dataService.Post(urlNoti, this.notificacion).subscribe( msg => {
            
          });
        }
      }
    },err => {
        console.log(err);
    })
  }

}
