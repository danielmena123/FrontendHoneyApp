import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SecurityService } from './services/security.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  IsAuthenticated = false;
  title = 'FrontEnd';

  constructor(
  ){
  }
  
  ngOnInit(): void {
    
  }
}
