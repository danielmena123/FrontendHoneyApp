import { Component, OnInit } from '@angular/core';
import { UsuarioAccess } from 'src/app/models/access';
import { Publicaciones } from 'src/app/models/publicaciones';
import { DataService } from 'src/app/services/data.service';
import { SecurityService } from 'src/app/services/security.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-destacados',
  templateUrl: './destacados.component.html',
  styleUrls: ['./destacados.component.css']
})
export class DestacadosComponent implements OnInit {

  private apiURL = environment.apiURL;

  usuario: UsuarioAccess;
  publicaciones: Publicaciones[];

  constructor(
    private securityServices: SecurityService,
    private dataServices: DataService
  ) { }

  ngOnInit(): void {
    this.CargarUsuario();
    this.CargarDatos();
  }

  CargarUsuario(){
    var data = this.securityServices.GetUser();
    this.usuario = data;
  }

  CargarDatos(){
    const url = `${this.apiURL}/Publicaciones/Top`;
    this.dataServices.get<Publicaciones[]>(url).subscribe( res => {
      this.publicaciones = res.body!;
    }, 
    err => {
      console.log(err);
    })
  }
}
