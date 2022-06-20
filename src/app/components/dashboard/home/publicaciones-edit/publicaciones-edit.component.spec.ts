import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicacionesEditComponent } from './publicaciones-edit.component';

describe('PublicacionesEditComponent', () => {
  let component: PublicacionesEditComponent;
  let fixture: ComponentFixture<PublicacionesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicacionesEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicacionesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
