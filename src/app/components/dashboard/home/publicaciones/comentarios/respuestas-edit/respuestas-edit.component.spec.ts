import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RespuestasEditComponent } from './respuestas-edit.component';

describe('RespuestasEditComponent', () => {
  let component: RespuestasEditComponent;
  let fixture: ComponentFixture<RespuestasEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RespuestasEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RespuestasEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
