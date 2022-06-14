import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { UsuarioAccess } from 'src/app/models/access';
import { Chats, VerfifyChat } from 'src/app/models/chats';
import { Usuarios } from 'src/app/models/usuarios';
import { ChatsService } from 'src/app/services/chats.service';
import { DataService } from 'src/app/services/data.service';
import { ModalesService } from 'src/app/services/modales.service';
import { SecurityService } from 'src/app/services/security.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-modal-c',
  templateUrl: './modal-c.component.html',
  styleUrls: ['./modal-c.component.css']
})
export class ModalCComponent implements OnInit {

  private apiURL = environment.apiURL;
  
  //Cargar Datos
  usuarios!: Usuarios[];
  usuario!: UsuarioAccess;  

  //Datos a Validar
  chats!: Chats;
  
  displayedColumns: string[] = ['nombreUsuario', 'correoElectronico', 'acciones'];
  dataSource!: MatTableDataSource<Usuarios>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private modal: ModalesService, 
    private _snackBar: MatSnackBar,
    private service: ChatsService,
    private dataService: DataService,
    private securityServices: SecurityService
    )  { }

  ngOnInit(): void {
    this.CargarUsuario();
    this.CargarDatos();
  }

  CargarDatos(){
    const url = `${this.apiURL}/Usuario/list/${this.usuario.usuariosId}`;
    this.dataService.get<Usuarios[]>(url).subscribe(res => {
      this.dataSource = new MatTableDataSource(res.body!);
      this.dataSource.paginator = this.paginator;
    })
  }

  CargarUsuario(){
    var data = this.securityServices.GetUser();
    this.usuario = data;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  closeModal(){
    this.modal.$modalList.emit(false);
  }

   mostrarChat(id: number, nombre: string){

    //Verficiar Existencia de Chat
    const url = `${this.apiURL}/Chat/${this.usuario.usuariosId}/${id}`;
    this.dataService.get<VerfifyChat>(url).subscribe(res => {

      //Mostrar Mensaje si no existe el chat
      if (res.body != null) {
        this.error();
      }

      //Habilitar el componente Mensaje
      else{
        const data = {
          id: id,
          nombre: nombre
        }

        //emitir datos para el nuevo chat
        this.service.$newChat.emit(data);          
        this.closeModal();        
      }
    },err => {
       console.log(err);
     })
   }

   //Devolver que ya posse un chat existente
   error(){
    this._snackBar.open('Ya tienes un chat con esta persona!, buscalo en tu listado de chats!', '', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    })
  }

}
