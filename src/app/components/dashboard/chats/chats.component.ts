import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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

  @Input()accept:string='*';
  @Input()files: File[] = [];
  @Input()file: File;
  @Input()placeholder:string ='';
  @Output() multipleImages = new EventEmitter<any>();
  @Output() message:any = new EventEmitter<any>();

  label:string = 'selecciona los archivos';
  labelPesoMax:string = 'Peso máximo por imagen 1MB';
  

  //camara
  WIDTH = 300;
  HEIGHT = 200;
  @Output() foto = new EventEmitter<any>();
  @Input() target: string;

  @ViewChild("video")
  public video: ElementRef;

  @ViewChild("canvas")
  public canvas: ElementRef;

  captures: string[] = [];
  error: any;
  isCaptured: boolean = false;
  btnCaptured: boolean = false;
  stream: any

  aceptFoto: boolean = false

  constructor(private modal: ModalesService, private breakpointObserver: BreakpointObserver, private elementRef:ElementRef) { 
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


  //camara
  async ngAfterViewInit() {
    await this.setupDevices();
  }
  
  async setupDevices() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
         this.stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
        if (this.stream ) {
          console.log('btn captresc', this.btnCaptured)
          this.btnCaptured = true
          console.log(this.btnCaptured)
          this.video.nativeElement.srcObject = this.stream ;
          this.video.nativeElement.play();
          this.error = null;
        } else {
          this.error = "You have no output video device";
        }
      } catch (e) {
        this.error = e;
      }
    }
  }
  
  capture() {
    this.drawImageToCanvas(this.video.nativeElement);
    this.captures.push(this.canvas.nativeElement.toDataURL("image/png"));
    this.aceptFoto = true
    this.isCaptured = true;
    console.log(this.captures)
  }
  
  drawImageToCanvas(image: any) {
    this.canvas.nativeElement
      .getContext("2d")
      .drawImage(image, 0, 0, this.WIDTH, this.HEIGHT);
  }
  
  async aceptImgs(){
    this.foto.emit(this.captures);
  }
  

  // onSelect(event) {
  //   if(this.files.length < 4){
  //   this.files.push(...event.addedFiles);
  //   this.multipleImages.emit(this.files)
  //   this.message.emit(event)
  //   // console.log(this.files)
  //   }
  // }

  // onRemove(event) {
  //   this.files.splice(this.files.indexOf(event), 1);
  //   this.multipleImages.emit(this.files)
  //   console.log(this.files)
  // }

  
  

}
