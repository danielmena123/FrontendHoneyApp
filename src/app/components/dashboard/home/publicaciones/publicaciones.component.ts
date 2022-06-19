import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UsuarioAccess } from 'src/app/models/access';
import { likes, likes_C } from 'src/app/models/likes';
import { Publicaciones } from 'src/app/models/publicaciones';
import { DataService } from 'src/app/services/data.service';
import { ModalesService } from 'src/app/services/modales.service';
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

  usuario!: UsuarioAccess;
  publicaciones!: Publicaciones[];
  modalSwitch: boolean = false;
  publicacionesId!: number;
  like!: likes_C; 
  subRef$!: Subscription;

  constructor(
    private modal: ModalesService, 
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
  }

  CargarDatos(){
    const url = `${this.apiURL}/Publicaciones`;    
    this.subRef$ = this.dataService.get<Publicaciones[]>(url).subscribe(res => {
      this.publicaciones = res.body!;
    })
  }

  CargarUsuario(){
    var data = this.securityServices.GetUser();
    this.usuario = data;
  }

  openComentarios(i:any, p: number, a: boolean){
    if(!a){
      this.publicacionesId = p;
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

  addLike(publicacionId: number, index: number){
    this.like = {
      modelosId: publicacionId,
      usuariosId: this.usuario.usuariosId
    }

    const url = `${this.apiURL}/Publicaciones/Likes`;
    this.dataService.Post<likes>(url, this.like).subscribe(res => {
      if(res.body != null){
        this.publicaciones[index].likes = res.body.numlikes
      }
    },err => {
        console.log(err);
    })
  }

  ngOnDestroy(): void {
    if (this.subRef$) {
      this.subRef$.unsubscribe();
    }
  }
}
