import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IResponse, Login } from 'src/app/models/access';
import * as shajs from 'sha.js';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { SecurityService } from 'src/app/services/security.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { Usuario_C } from 'src/app/models/usuarios';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private apiURL = environment.apiURL;

  public usuario!: Usuario_C;
  loginAccess!: Login;
  loginForm: FormGroup;
  registerForm: FormGroup;
  loading = false;
  hide = true;  
  subRef$!: Subscription;
  selected = new FormControl(0);
    
  constructor(
    private _builder: FormBuilder, 
    private router:Router, 
    private _snackBar: MatSnackBar,
    private dataService: DataService,
    private securityService: SecurityService
    ) {

      this.securityService.LogOff();
    
      this.loginForm = this._builder.group({
        CorreoElectronico: ["", Validators.compose([Validators.email, Validators.required])],
        Contraseña: ["", Validators.required],
      }),
      this.registerForm = this._builder.group({
        Nombres : ['', Validators.required],
        Apellidos: ['', Validators.required],
        NombreUsuario: ['',[ Validators.required, Validators.maxLength(12)]],
        CorreoElectronico: ['', Validators.compose([Validators.email, Validators.required])],
        Contraseña: ['', Validators.required]
      })
   }

  ngOnInit(): void {
    
  }

  ingresar(){

    let contraseñaEncrypter = shajs('sha256').update(this.loginForm.value.Contraseña).digest('hex');

    this.loginAccess = {
      correoElectronico: this.loginForm.value.CorreoElectronico,
      contraseña: contraseñaEncrypter
    }
    
    const url = `${this.apiURL}/Access`;
    this.subRef$ = this.dataService.Post<IResponse>(url, this.loginAccess)
                    .subscribe((res) => {
                      const token = res.body?.token;
                      const user = res.body?.usuario;
                      this.securityService.SetAuthData(token, user);
                      this.fakeloading();
                    }, err => {
                      console.log(err)
                      this.error();
                      this.loginForm.reset();
                    })
  }

  registrar(){

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
        this.selected.setValue(0);
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

  fakeloading(){
    this.loading = true;
    setTimeout(() => {
      this.router.navigate(['dashboard']);
    }, (2000));
  }

  error(){
    this._snackBar.open('Correo Electronico o contraseña ingresado son invalidos', '', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    })
  }

  ngOnDestroy(): void {
    if (this.subRef$) {
      this.subRef$.unsubscribe();
    }
  }

}

