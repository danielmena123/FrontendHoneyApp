import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../shared/shared/shared.module';
import { HomeComponent } from './home/home.component';
import { ChatsComponent } from './chats/chats.component';
import { AyudaComponent } from './ayuda/ayuda.component';
import { ModalPComponent } from './modal-p/modal-p.component';
import { PublicacionesComponent } from './home/publicaciones/publicaciones.component';
import { ComentariosComponent } from './home/publicaciones/comentarios/comentarios.component';
import { RespuestasComponent } from './home/publicaciones/comentarios/respuestas/respuestas.component';
import { ModalCComponent } from './modal-c/modal-c.component';
import { ListadoChatsComponent } from './chats/listado-chats/listado-chats.component';
import { MensajesComponent } from './chats/mensajes/mensajes.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ErrorComponent } from './error/error.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { PublicacionesEditComponent } from './home/publicaciones-edit/publicaciones-edit.component';
import { ComentariosEditComponent } from './home/publicaciones/comentarios-edit/comentarios-edit.component';
import { RespuestasEditComponent } from './home/publicaciones/comentarios/respuestas-edit/respuestas-edit.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { AjustesComponent } from './ajustes/ajustes.component';


@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    ChatsComponent,
    AyudaComponent,
    ModalPComponent,
    PublicacionesComponent,
    ComentariosComponent,
    RespuestasComponent,
    ModalCComponent,
    ListadoChatsComponent,
    MensajesComponent,
    NavbarComponent,
    ErrorComponent,
    NotificacionesComponent,
    PublicacionesEditComponent,
    ComentariosEditComponent,
    RespuestasEditComponent,
    UsuarioComponent,
    AjustesComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
