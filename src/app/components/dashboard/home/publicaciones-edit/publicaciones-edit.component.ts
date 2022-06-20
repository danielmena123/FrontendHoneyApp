import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioAccess } from 'src/app/models/access';
import { Publicaciones, Publicacion_U } from 'src/app/models/publicaciones';
import { DataService } from 'src/app/services/data.service';
import { PublicacionesService } from 'src/app/services/publicaciones.service';
import { SecurityService } from 'src/app/services/security.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-publicaciones-edit',
  templateUrl: './publicaciones-edit.component.html',
  styleUrls: ['./publicaciones-edit.component.css']
})
export class PublicacionesEditComponent implements OnInit {

  private apiURL = environment.apiURL;

  @Input() publicacion: Publicaciones;
  usuario: UsuarioAccess;
  publicForm: FormGroup;
  editPublicacion: Publicacion_U;

  constructor(
    private securityServices: SecurityService, 
    private dataServices: DataService,
    private _builder: FormBuilder, 
    private publicacionesService: PublicacionesService
    ) {
    this.publicForm = this._builder.group({
      Descripcion: ['', Validators.required],
      PublicacionesId: ['']
    })
   }

  ngOnInit(): void {
    this.CargarUsuario();
    this.CargarDatos();
  }

  CargarUsuario(){
    var data = this.securityServices.GetUser();
    this.usuario = data;
  }


  CargarDatos(){
    this.publicForm.patchValue({
      Descripcion: this.publicacion.descripcion,
      PublicacionesId: this.publicacion.publicacionesId
    })
  }

  Actualizar(){
    this.editPublicacion = {
      descripcion: this.publicForm.value.Descripcion,  
      publicacionesId: this.publicForm.value.PublicacionesId
    }

    console.log(this.editPublicacion);
    const url = `${this.apiURL}/Publicaciones/${this.editPublicacion.publicacionesId}`;
    this.dataServices.Put(url, this.editPublicacion).subscribe(res => {
      this.publicacionesService.$modal.emit(true);
    })
  }  

  closeModal(){
    this.publicacionesService.$modal.emit(true);
  }
}
