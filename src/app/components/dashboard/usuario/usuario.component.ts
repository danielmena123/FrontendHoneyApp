import * as shajs from 'sha.js';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario } from 'src/app/models/usuarios';
import { DataService } from 'src/app/services/data.service';
import { SecurityService } from 'src/app/services/security.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  apiURL = environment.apiURL;
 
  usuario: Usuario;
  userForm: FormGroup;
  fecha = new Date(Date.now());
  hide = true;  
  hidetwo = true;

  constructor(
    private _builder: FormBuilder,
    private _snackBar: MatSnackBar,
    private securityServices: SecurityService,
    private dataServices: DataService,
  ) { 
    this.userForm = this._builder.group({
      Nombres : ['', Validators.required],
      Apellidos: ['', Validators.required],
      NombreUsuario: ['',[ Validators.required, Validators.maxLength(12)]],
      CorreoElectronico: ['', Validators.compose([Validators.email, Validators.required])],
      ContraseñaAnterior: ['', Validators.required],
      Contraseña: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.CargarUsuario();
  }

  CargarUsuario(){
    let user: Usuario = this.securityServices.GetUser();
    const url = `${this.apiURL}/Usuarios/ById/${user.usuariosId}`;
    this.dataServices.get<Usuario>(url).subscribe(res => {
      this.usuario = res.body!;
      this.CargarDatos();
      console.log(this.usuario.contraseña)
    });
  }

  CargarDatos(){
    this.userForm.patchValue({
      Nombres: this.usuario.nombres,
      Apellidos: this.usuario.apellidos,
      NombreUsuario: this.usuario.nombreUsuario,
      CorreoElectronico: this.usuario.correoElectronico,
      ContraseñaAnterior: '',
      Contraseña: ''
    })
  }

  Actualizar(){

    let contraseñaAnteriorEncrypter = shajs('sha256').update(this.userForm.value.ContraseñaAnterior).digest('hex');
    let contraseñaEncrypter = shajs('sha256').update(this.userForm.value.Contraseña).digest('hex');

    let updateUser: Usuario = {
      usuariosId: this.usuario.usuariosId,
      nombres: this.userForm.value.Nombres,
      apellidos: this.userForm.value.Apellidos,
      nombreUsuario: this.userForm.value.NombreUsuario,
      correoElectronico: this.userForm.value.CorreoElectronico,
      contraseña: contraseñaEncrypter,
      rolesId: 2
    }

    if(contraseñaAnteriorEncrypter == this.usuario.contraseña){
      const url = `${this.apiURL}/Usuarios/${this.usuario.usuariosId}`;
      this.dataServices.Put<Usuario>(url, updateUser).subscribe(res => {
        this.CargarUsuario();
      })
    }
    else{
      this.error();
    }
  }

  error(){
    this._snackBar.open('Contraseña Incorrecta', '', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    })
  }
}
