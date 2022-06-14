import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioAccess } from 'src/app/models/access';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  
  mobileQuery: MediaQueryList;
  usuario!: UsuarioAccess;

  //fillerNav = Array.from({length: 50}, (_, i) => `Nav Item ${i + 1}`);
  fillerNav=[
    {name:"home", route:"/dashboard/",icon:"home"},
    {name:"chats", route:"/dashboard/chats",icon:"question_answer"},
    {name:"ayuda", route:"/dashboard/ayuda", icon:"quiz"}
  ]

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
     media: MediaMatcher,
      private router: Router,
      private securityServices: SecurityService
      ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.CargarUsuario();
  }

  CargarUsuario(){
    var data = this.securityServices.GetUser();
    this.usuario = data;
  }

  logout(){
    this.securityServices.LogOff();
    this.router.navigate(["/logout"]);
  }

  shouldRun = true;
}
