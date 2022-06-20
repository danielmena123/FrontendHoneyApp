import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioAccess } from 'src/app/models/access';
import { Respuestas, Respuesta_U } from 'src/app/models/Respuestas';
import { DataService } from 'src/app/services/data.service';
import { RespuestasService } from 'src/app/services/respuestas.service';
import { SecurityService } from 'src/app/services/security.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-respuestas-edit',
  templateUrl: './respuestas-edit.component.html',
  styleUrls: ['./respuestas-edit.component.css']
})
export class RespuestasEditComponent implements OnInit {

  private apiURL = environment.apiURL;

  @Input() answer: Respuestas
  answerForm: FormGroup;
  usuario: UsuarioAccess;
  respuesta: Respuesta_U;

  constructor(
    private _builder: FormBuilder,
    private respuestasService: RespuestasService,
    private securityServices: SecurityService,
    private dataServices: DataService
  ) { 
    this.answerForm = this._builder.group({
      Descripcion: ['', Validators.required],
      RespuestasId: ['']
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
    this.answerForm.patchValue({
      Descripcion: this.answer.descripcion,
      RespuestasId: this.answer.respuestasId
    })
  }

  Actualizar(){
    this.respuesta = {
      descripcion: this.answerForm.value.Descripcion,
      respuestasId: this.answerForm.value.RespuestasId
    }

    const url = `${this.apiURL}/Respuestas/${this.respuesta.respuestasId}`;
    this.dataServices.Put(url, this.respuesta).subscribe(res => {
      this.respuestasService.$modal.emit(true);
    })
  }

  closeModal(){
    this.respuestasService.$modal.emit(true);
  }

}
