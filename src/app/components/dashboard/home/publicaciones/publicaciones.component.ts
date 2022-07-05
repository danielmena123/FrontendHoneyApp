import { Component, OnDestroy, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { UsuarioAccess } from 'src/app/models/access';
import { likes, likes_C } from 'src/app/models/likes';
import { NotificacionesForo } from 'src/app/models/Notificaciones';
import { Publicaciones } from 'src/app/models/publicaciones';
import { DataService } from 'src/app/services/data.service';
import { ModalesService } from 'src/app/services/modales.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { PublicacionesService } from 'src/app/services/publicaciones.service';
import { SecurityService } from 'src/app/services/security.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.component.html',
  styleUrls: ['./publicaciones.component.css']
})
export class PublicacionesComponent implements OnInit, OnDestroy {

  private apiURL = environment.apiURL;

  //usuario logeodo
  usuario: UsuarioAccess;
  publicacion: Publicaciones;

  //variables de Datos
  publicaciones: Publicaciones[];
  notificacion: NotificacionesForo;
  publicacionesId: number;
  usuarioPublicacion: number;
  like: likes_C; 

  //variables de cambio
  modalSwitch: boolean = false;
  subRef$: Subscription;  
  classLike: number;
  //mat spiner
  loading = false;
  color: ThemePalette = 'accent';

  constructor(
    private modal: ModalesService, 
    private notificacionesService: NotificacionesService,
    private publicacionesService: PublicacionesService,
    private securityServices: SecurityService,
    private dataService: DataService,
    ) {
    }

  ngOnInit(): void {
    this.CargarUsuario();
    this.CargarDatos();
    this.modal.$refres.subscribe(data => {
      if(data){
        this.ngOnInit();
      }
    });
    this.publicacionesService.$modal.subscribe(res => {

      if(res == true){
        this.modalSwitch = false;
        console.log(this.modalSwitch)
        this.CargarDatos();
      }
    });
    this.notificacionesService.$CargarPublicaciones.subscribe(res => {
      if(res == true){
        this.loading = true!
        setTimeout(() => {
          this.CargarDatos();
          this.loading = false;
        }, (1000))        
      }
    })

  }

  CargarDatos(){
    const url = `${this.apiURL}/Publicaciones/${this.usuario.usuariosId}`;    
    this.subRef$ = this.dataService.get<Publicaciones[]>(url).subscribe(res => {
      this.publicaciones = res.body!;
    })
  }

  CargarUsuario(){
    var data = this.securityServices.GetUser();
    this.usuario = data;
  }

  openComentarios(i:any, p: Publicaciones, a: boolean){
    if(!a){
      this.publicacionesId = p.publicacionesId;
      this.usuarioPublicacion = p.usuariosId;
      this.publicaciones.forEach(element => {
        element.activo = false;
      })
      this.publicaciones[i].activo = true;      
    }
    else{
      this.publicaciones.forEach(element => {
        element.activo = false;
      });
    }
  }

  openModal(data: Publicaciones){
    this.publicacion = data;
    this.modalSwitch = true;
  }

  Eliminar(id: number){
    const url = `${this.apiURL}/Publicaciones/${id}`;
    this.dataService.delete(url).subscribe(res => {
      this.publicacionesService.$modal.emit(true);
    })
  }

  addLike(publicacionId: number, index: number){

    this.like = {
      modelosId: publicacionId,
      usuariosId: this.usuario.usuariosId,
    }

    const url = `${this.apiURL}/Likes/Publicaciones`;
    this.dataService.Post<likes>(url, this.like).subscribe(res => {
      if(res.body != null){
        this.publicaciones[index].numLikes = res.body.numlikes;
        if(this.publicaciones[index].userLike == 0){
          this.publicaciones[index].userLike = 1
        }else {
          this.publicaciones[index].userLike = 0
        }

        if(this.usuario.usuariosId != this.publicaciones[index].usuariosId){
          const urlNoti = `${this.apiURL}/Notificaciones/Likes`;
          this.notificacion = {
            descripcion: `le gusto tu Publicacion`,
            referenciaId: this.publicaciones[index].publicacionesId,
            tipo_NotificacionesId: 4,
            usuarioReceptorId: this.publicaciones[index].usuariosId,
            usuariosId: this.usuario.usuariosId
          }       

          this.dataService.Post(urlNoti, this.notificacion).subscribe( msg => {
            
          });
        }
      }
    },err => {
        console.log(err);
    });
  }

  ngOnDestroy(): void {
    if (this.subRef$) {
      this.subRef$.unsubscribe();
    }
  }
}
