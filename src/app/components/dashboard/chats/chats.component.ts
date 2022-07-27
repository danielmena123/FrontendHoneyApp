import { Component, OnInit } from '@angular/core';
import { ChatsService } from 'src/app/services/chats.service';
import { MensajesService } from 'src/app/services/mensajes.service';
import { ModalesService } from 'src/app/services/modales.service';
import { SignalrcustomService } from 'src/app/services/signalrcustom.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit {
  modalSwitch!: boolean;
  ChatId!: number;
  openMessag: boolean = false

  destroyed = new Subject<void>();
  currentScreenSize: string;
  comentariosMobil: string = "XSmall"
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);

  constructor(private modal: ModalesService, private breakpointObserver: BreakpointObserver) { 
    breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(takeUntil(this.destroyed))
      .subscribe(result => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.currentScreenSize = this.displayNameMap.get(query) ?? 'Unknown';
            console.log(this.currentScreenSize)
          }
        }
      });
  }

  ngOnInit(): void {
    this.modal.$modalList.subscribe(data => {
      this.modalSwitch = data;
    });    
  }

  openModal(){
    this.modalSwitch = true;
  }
  openMessage(req: boolean){
    this.openMessag = req
    console.log(this.openMessage)
  }

}
