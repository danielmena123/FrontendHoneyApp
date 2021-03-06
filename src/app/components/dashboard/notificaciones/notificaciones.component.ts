import { Component, OnInit } from '@angular/core';
import { UsuarioAccess } from 'src/app/models/access';
import { NotificacionesForo } from 'src/app/models/Notificaciones';
import { DataService } from 'src/app/services/data.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { SecurityService } from 'src/app/services/security.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit {

  private apiURL = environment.apiURL;

  usuario: UsuarioAccess;
  notificaciones: NotificacionesForo[];
  like: boolean;

  constructor(
    private notificacionesService: NotificacionesService,
    private securityServices: SecurityService,
    private dataServices: DataService
  ) { }

  ngOnInit(): void {
    this.CargarUsuario();
    this.CargarDatos();
    this.notificacionesService.$refrescarNotificaciones.subscribe(res => {
      if(res == true){        
        this.CargarUsuario();
        this.CargarDatos();
      }
    })
  }

  CargarUsuario(){
    var data = this.securityServices.GetUser();
    this.usuario = data;
  }

  CargarDatos(){
    const url = `${this.apiURL}/Notificaciones/${this.usuario.usuariosId}`;
    this.dataServices.get<NotificacionesForo[]>(url).subscribe(res => {
      this.notificaciones = res.body!;
      this.notificaciones.forEach(item => {
        const result =  new Date(Date.now()).getTime() - new Date(item.fecha!).getTime();
        if ((result/(1000*60*60)) < 24){
          item.shortime = true;
        }else{
          item.shortime = false;
        }
      })
    })
  }

  Eliminar(notificacionesId: number | undefined){
    const url = `${this.apiURL}/Notificaciones/${notificacionesId}`;
    this.dataServices.delete(url).subscribe(res => {
      console.log(this.CargarDatos())
    })
  }

}
