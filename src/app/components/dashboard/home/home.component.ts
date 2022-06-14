import { Component, OnInit } from '@angular/core';
import { UsuarioAccess } from 'src/app/models/access';
import { ModalesService } from 'src/app/services/modales.service';
import { PublicacionesService } from 'src/app/services/publicaciones.service';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  modalSwitch:boolean = false;
  usuario!: UsuarioAccess;

  constructor(
    private modal: ModalesService,
    private securityServices: SecurityService,
    ) { }

  ngOnInit(): void {
    this.modal.$modal.subscribe(data => {
      this.modalSwitch = data
    });
    this.CargarUsuario();
  }

  openModal(){
    this.modalSwitch = true;
  }

  CargarUsuario(){
    var data = this.securityServices.GetUser();
    this.usuario = data;
  }

}
