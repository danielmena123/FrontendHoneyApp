import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario_C } from 'src/app/models/usuarios';
import * as shajs from 'sha.js';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { SecurityService } from 'src/app/services/security.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  private apiURL = environment.apiURL;

  loading = false;
  registerForm: FormGroup;
  hide = true;
  public usuario!: Usuario_C;
  
  constructor(
    private _builder: FormBuilder,
    private router: Router, 
    private _snackBar: MatSnackBar,
    private dataService: DataService,
    private securityServices: SecurityService

    ) { 
    this.registerForm = this._builder.group({
      Nombres : ['', Validators.required],
      Apellidos: ['', Validators.required],
      NombreUsuario: ['', Validators.required],
      CorreoElectronico: ['', Validators.compose([Validators.email, Validators.required])],
      Contraseña: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    
  }

  ingresar(){

    let contraseñaEncrypter = shajs('sha256').update(this.registerForm.value.Contraseña).digest('hex');

    this.usuario = {
      nombres: this.registerForm.value.Nombres,
      apellidos: this.registerForm.value.Apellidos,
      nombreUsuario: this.registerForm.value.NombreUsuario,
      correoElectronico: this.registerForm.value.CorreoElectronico,
      contraseña: contraseñaEncrypter,
      roleId: 2
    }

    const url = `${this.apiURL}/Usuario`;
    this.dataService.Post<Usuario_C>(url, this.usuario).subscribe(res => {
      if(res != null){
        this.router.navigate(['login']);
      }
      else{
        this.error();
        this.registerForm.reset();
      }
    },err => {
        this.error();
        this.registerForm.reset();
    })    
  }
  error(){
    this._snackBar.open('Nombre de Usuario o Correo Electronico ya esta en uso', '', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    })
  }
}
