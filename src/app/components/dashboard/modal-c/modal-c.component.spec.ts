import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCComponent } from './modal-c.component';

describe('ModalCComponent', () => {
  let component: ModalCComponent;
  let fixture: ComponentFixture<ModalCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
