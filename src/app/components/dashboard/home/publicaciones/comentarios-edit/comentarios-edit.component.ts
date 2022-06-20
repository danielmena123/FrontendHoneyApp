import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioAccess } from 'src/app/models/access';
import { Comentarios, Comentario_U } from 'src/app/models/comentarios';
import { ComentariosService } from 'src/app/services/comentarios.service';
import { DataService } from 'src/app/services/data.service';
import { SecurityService } from 'src/app/services/security.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-comentarios-edit',
  templateUrl: './comentarios-edit.component.html',
  styleUrls: ['./comentarios-edit.component.css']
})
export class ComentariosEditComponent implements OnInit {

  private apiURL = environment.apiURL;

  @Input() comment: Comentarios;
  usuario: UsuarioAccess;
  commentForm: FormGroup;
  comentario: Comentario_U;

  constructor(
    private comentarioService: ComentariosService,
    private dataService: DataService,
    private securityServices: SecurityService,
    private _builder: FormBuilder
  ) {
    this.commentForm = this._builder.group({
      Descripcion: ['', Validators.required],
      ComentariosId: ['']
    })
   }

  ngOnInit(): void {
    this.CargarUsuario();
    this.CargarDatos();
  }

  CargarDatos(){
    this.commentForm.patchValue({
      Descripcion: this.comment.descripcion,
      ComentariosId: this.comment.comentariosId
    })
  }

  CargarUsuario(){
    var data = this.securityServices.GetUser();
    this.usuario = data;
  }

  Actualizar(){
    this.comentario = {
      comentariosId: this.commentForm.value.ComentariosId,
      descripcion: this.commentForm.value.Descripcion
    }
    const url = `${this.apiURL}/Comentarios/${this.comentario.comentariosId}`
    this.dataService.Put(url, this.comentario).subscribe(res => {
      this.comentarioService.$modal.emit(true);
    })
  }

  closeModal(){
    this.comentarioService.$modal.emit(true);
  }  

}
