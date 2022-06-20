import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioAccess } from 'src/app/models/access';
import { likes, likes_C } from 'src/app/models/likes';
import { Respuestas, Respuesta_C } from 'src/app/models/Respuestas';
import { DataService } from 'src/app/services/data.service';
import { RespuestasService } from 'src/app/services/respuestas.service';
import { SecurityService } from 'src/app/services/security.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-respuestas',
  templateUrl: './respuestas.component.html',
  styleUrls: ['./respuestas.component.css']
})
export class RespuestasComponent implements OnInit {

  private apiURL = environment.apiURL;

  usuario!: UsuarioAccess;
  like!: likes_C; 
  modalSwitch: boolean = false;
  respuestas!: Respuestas[];
  respuestForm!: FormGroup;
  respuesta!: Respuesta_C;
  answer: Respuestas;

  @Input() comentariosId!: number;

  constructor(
    private _builder: FormBuilder, 
    private respuestasService: RespuestasService,
    private dataService: DataService,
    private securityServices: SecurityService
    ) {
    this.respuestForm = this._builder.group({
      Descripcion: ['', Validators.required]
    })
   }

  ngOnInit(): void {
    this.CargarUsuario();
    this.CargarDatos();
    this.respuestasService.$modal.subscribe(res => {
      if(res == true){
        this.CargarDatos();
        this.modalSwitch = false;
      }
    })
  }

  CargarDatos(){
    const url = `${this.apiURL}/Respuestas/${this.comentariosId}`
    this.dataService.get<Respuestas[]>(url).subscribe( res => {
      this.respuestas = res.body!;
    })
  }

  CargarUsuario(){
    var data = this.securityServices.GetUser();
    this.usuario = data;
  }

  enviarRespuesta(){
    this.respuesta = {
      descripcion: this.respuestForm.value.Descripcion,
      comentariosId: this.comentariosId,
      usuariosId: this.usuario.usuariosId
    }

    const url = `${this.apiURL}/Respuestas/`;
    this.dataService.Post<Respuesta_C>(url, this.respuesta).subscribe( res => {
      this.CargarDatos();
      this.respuestForm.reset();
    },
    err => {
      console.log(err);
    })
  }

  openModal(data: Respuestas){
    this.answer = data;
    this.modalSwitch = true;
  }

  Eliminar(id: number){
    const url = `${this.apiURL}/Respuestas/${id}`;
    this.dataService.delete(url).subscribe(res => {
      this.CargarDatos();
    })
  }

  addLike(respuestaId: number, index: number){
    this.like = {
      modelosId: respuestaId,
      usuariosId: this.usuario.usuariosId
    }

    const url = `${this.apiURL}/Respuestas/Likes`;
    this.dataService.Post<likes>(url, this.like).subscribe(res => {
      if(res.body != null){
        this.respuestas[index].likes = res.body.numlikes
      }
    },err => {
        console.log(err);
    })
  }

}
