import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioAccess } from 'src/app/models/access';
import { Comentarios, Comentario_C } from 'src/app/models/comentarios';
import { likes, likes_C } from 'src/app/models/likes';
import { ComentariosService } from 'src/app/services/comentarios.service';
import { DataService } from 'src/app/services/data.service';
import { SecurityService } from 'src/app/services/security.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css']
})
export class ComentariosComponent implements OnInit {

  private apiURL = environment.apiURL;

  usuario!: UsuarioAccess;
  like!: likes_C; 
  comentarios!: Comentarios[];
  commentForm!: FormGroup;
  comentario!: Comentario_C;
  comentariosId!: number;
  @ViewChild('div') div!: ElementRef;

  @Input() publicacionesId!: number;

  constructor(
    private _builder: FormBuilder, 
    private dataService: DataService,
    private securityServices: SecurityService
    ) {
    this.commentForm = this._builder.group({
      Descripcion: ['', Validators.required],
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

    const url = `${this.apiURL}/Comentarios/${this.publicacionesId}`;
    this.dataService.get<Comentarios[]>(url).subscribe(res => {
      this.comentarios = res.body!;
      this.comentarios.forEach(item => {
        const result =  new Date(Date.now()).getTime() - new Date(item.fecha).getTime();
        if ((result/(1000*60*60)) < 24){
          item.shortime = true;
        }
        else{
          item.shortime = false;
        }
      })
    })
  }

  enviarComentario(){
    this.comentario = {
      descripcion: this.commentForm.value.Descripcion,
      publicacionesId: this.publicacionesId,
      usuariosId: this.usuario.usuariosId
    }

    const url = `${this.apiURL}/Comentarios/`;
    this.dataService.Post<Comentario_C>(url, this.comentario).subscribe(res => {
      this.CargarDatos();
      this.commentForm.reset();
    },
    err => {
      console.log(err);
    })
  }

  openRespuestas(i:any, c: number, activo: boolean){
    if(!activo){
      this.comentariosId = c;
      this.comentarios.forEach(element => {
        element.activo = false;
      })
      this.comentarios[i].activo = true;
    }
    else{
      this.comentarios.forEach(element => {
        element.activo = false;
      })
    }
  }

  addLike(comentarioId: number, index: number){
    this.like = {
      modelosId: comentarioId,
      usuariosId: this.usuario.usuariosId
    }

    const url = `${this.apiURL}/Comentarios/Likes`;
    this.dataService.Post<likes>(url, this.like).subscribe(res => {
      if(res.body != null){
        this.comentarios[index].likes = res.body.numlikes
      }
    },err => {
        console.log(err);
    })
  }

}
