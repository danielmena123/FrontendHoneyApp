import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioAccess } from 'src/app/models/access';
import { Publicacion_C } from 'src/app/models/publicaciones';
import { DataService } from 'src/app/services/data.service';
import { ModalesService } from 'src/app/services/modales.service';
import { PublicacionesService } from 'src/app/services/publicaciones.service';
import { SecurityService } from 'src/app/services/security.service';
import { SignalrcustomService } from 'src/app/services/signalrcustom.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-modal-p',
  templateUrl: './modal-p.component.html',
  styleUrls: ['./modal-p.component.css']
})
export class ModalPComponent implements OnInit {

  private apiURL = environment.apiURL;

  //Variables de Creacion
  usuario!: UsuarioAccess;
  publicForm!: FormGroup;
  public publicacion!: Publicacion_C;
  
  constructor(
    private _builder: FormBuilder, 
    private modal: ModalesService, 
    private dataService: DataService,
    private securityServices: SecurityService,
    private signalr: SignalrcustomService
    ) {
    this.publicForm = this._builder.group({
      Descripcion: ['', Validators.required]
    })
   }

  ngOnInit(): void {
    this.CargarUsuario();
  }

  //Cerrar Componente
  closeModal(){
    this.modal.$modal.emit(false);
  }

  //Nueva Publicacion
  ingresar(){

    //Crear Publicacion
    this.publicacion = {
      descripcion: this.publicForm.value.Descripcion,
      usuariosId: this.usuario.usuariosId
    }

    this.signalr.NewPublicacion();
    const url = `${this.apiURL}/Publicaciones`;
    this.dataService.Post<Publicacion_C>(url, this.publicacion).subscribe(res => {
      if(res != null){
        this.modal.$refres.emit(true);
        this.closeModal();
      }
    })
  }

  CargarUsuario(){
    var data = this.securityServices.GetUser();
    this.usuario = data;
  }

}
