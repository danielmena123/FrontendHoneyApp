import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AjustesComponent } from './ajustes/ajustes.component';
import { AyudaComponent } from './ayuda/ayuda.component';
import { ChatsComponent } from './chats/chats.component';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import { UsuarioComponent } from './usuario/usuario.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent, children: [
      {path: '', component: HomeComponent},
      {path: 'chats', component: ChatsComponent},
      {path: 'ayuda', component: AyudaComponent},
      {path: 'usuario', component: UsuarioComponent},
      {path: 'ajustes', component: AjustesComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
