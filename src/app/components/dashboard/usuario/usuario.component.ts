import * as shajs from 'sha.js';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario } from 'src/app/models/usuarios';
import { DataService } from 'src/app/services/data.service';
import { SecurityService } from 'src/app/services/security.service';
import { environment } from 'src/environments/environment';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  apiURL = environment.apiURL;
 
  usuario: Usuario;
  imagen: any;
  datospersonalesForm: FormGroup;
  seguridadForm: FormGroup;
  contactoForm: FormGroup;
  fecha = new Date(Date.now());
  hide = true;  
  hidetwo = true;

  constructor(
    private _builder: FormBuilder,
    private _snackBar: MatSnackBar,
    private firebaseService: FirebaseService,
    private securityServices: SecurityService,
    private dataServices: DataService,
  ) { 
    this.datospersonalesForm = this._builder.group({
      Nombres : ['', Validators.required],
      Apellidos: ['', Validators.required],
      NombreUsuario: ['',[ Validators.required, Validators.maxLength(12)]]     
    });
    this.seguridadForm = this._builder.group({
      ContraseñaAnterior: ['', Validators.required],
      Contraseña: ['', Validators.required]
    });
    this.contactoForm = this._builder.group({
      CorreoElectronico: ['', Validators.compose([Validators.email, Validators.required])],
      URL: [''] 
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
    });
  }

  CargarDatos(){
    this.datospersonalesForm.patchValue({
      Nombres: this.usuario.nombres,
      Apellidos: this.usuario.apellidos,
      NombreUsuario: this.usuario.nombreUsuario     
    });
    this.contactoForm.patchValue({
      CorreoElectronico: this.usuario.correoElectronico,
      URL: this.usuario.url
      
    });
    console.log(this.contactoForm.value.URL)
  }


  ActualizarDatosPersonales(){
    const url = `${this.apiURL}/Usuarios/${this.usuario.usuariosId}`;

    this.usuario.nombres = this.datospersonalesForm.value.Nombres;
    this.usuario.apellidos = this.datospersonalesForm.value.Apellidos;
    this.usuario.nombreUsuario = this.datospersonalesForm.value.NombreUsuario;

    this.dataServices.Put(url, this.usuario).subscribe(res => {
      this.CargarUsuario();
    })
  }


  ActualizarSeguridad(){
    const url = `${this.apiURL}/Usuarios/${this.usuario.usuariosId}`;

    let contraseñaAnteriorEncrypter = shajs('sha256').update(this.seguridadForm.value.ContraseñaAnterior).digest('hex');
    let contraseñaEncrypter = shajs('sha256').update(this.seguridadForm.value.Contraseña).digest('hex');    

    console.log(contraseñaAnteriorEncrypter);
    console.log(this.usuario.contraseña);

    if(contraseñaAnteriorEncrypter == this.usuario.contraseña){
      this.usuario.contraseña = contraseñaEncrypter;
      this.dataServices.Put(url, this.usuario).subscribe(res => {
        this.CargarUsuario();
        this.seguridadForm.reset();
      })
    }
    else
    {
      this.error();
    }
  }

  mostrarImagen(event: any){
    let imagen = event.target.files;
    let reader = new FileReader();

    reader.readAsDataURL(imagen[0]);
    reader.onloadend = () => {
      this.imagen = reader.result;
    }
  }

  ActualizarContacto(event: any){    
    const url = `${this.apiURL}/Usuarios/${this.usuario.usuariosId}`;
    this.usuario.correoElectronico = this.contactoForm.value.CorreoElectronico;    

    this.firebaseService.subirImagen(`${this.usuario.nombreUsuario}_${Date.now()}`, this.imagen).then(res => {
      if(res != null){          
        this.usuario.url = res;
        this.dataServices.Put(url, this.usuario).subscribe((res => {
          this.CargarUsuario();
          this.imagen = undefined;
        }),
        err => {
          console.log(err);
        })
      }
    });
  }

  // Actualizar(){

  //   let contraseñaAnteriorEncrypter = shajs('sha256').update(this.userForm.value.ContraseñaAnterior).digest('hex');
  //   let contraseñaEncrypter = shajs('sha256').update(this.userForm.value.Contraseña).digest('hex');

  //   let updateUser: Usuario = {
  //     usuariosId: this.usuario.usuariosId,
  //     nombres: this.userForm.value.Nombres,
  //     apellidos: this.userForm.value.Apellidos,
  //     nombreUsuario: this.userForm.value.NombreUsuario,
  //     correoElectronico: this.userForm.value.CorreoElectronico,
  //     contraseña: contraseñaEncrypter,
  //     rolesId: 2
  //   }

  //   if(contraseñaAnteriorEncrypter == this.usuario.contraseña){
  //     const url = `${this.apiURL}/Usuarios/${this.usuario.usuariosId}`;
  //     this.dataServices.Put<Usuario>(url, updateUser).subscribe(res => {
  //       this.CargarUsuario();
  //     })
  //   }
  //   else{
  //     this.error();
  //   }
  // }

  error(){
    this._snackBar.open('Contraseña Incorrecta', '', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    })
  }
}
