import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoChatsComponent } from './listado-chats.component';

describe('ListadoChatsComponent', () => {
  let component: ListadoChatsComponent;
  let fixture: ComponentFixture<ListadoChatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoChatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoChatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
