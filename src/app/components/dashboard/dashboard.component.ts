import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SecurityService } from 'src/app/services/security.service';
import { SignalrcustomService } from 'src/app/services/signalrcustom.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnDestroy {

  IsAuthenticated = false;
  title = 'FrontEnd';
  private subtsAuth$: Subscription;

  constructor(
    private signalr: SignalrcustomService,
    private securityService: SecurityService
  ){
    this.IsAuthenticated = this.securityService.IsAuthorized;
    this.subtsAuth$ = this.securityService.authChallenge$.subscribe(
      (isAuth) => {
        this.IsAuthenticated = isAuth;
      }
    );
    this.signalr.startConnection();
  }

  ngOnDestroy(): void {
    if (this.subtsAuth$) {
      this.subtsAuth$.unsubscribe();
    }        
  }
}
