import { Component, OnInit } from '@angular/core';
import { ChatsService } from 'src/app/services/chats.service';
import { MensajesService } from 'src/app/services/mensajes.service';
import { ModalesService } from 'src/app/services/modales.service';
import { SignalrcustomService } from 'src/app/services/signalrcustom.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit {
  modalSwitch!: boolean;
  ChatId!: number;

  constructor(private modal: ModalesService) { }

  ngOnInit(): void {
    this.modal.$modalList.subscribe(data => {
      this.modalSwitch = data;
    });    
  }

  openModal(){
    this.modalSwitch = true;
  }

}
