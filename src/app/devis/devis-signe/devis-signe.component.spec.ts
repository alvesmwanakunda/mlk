import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevisSigneComponent } from './devis-signe.component';

describe('DevisSigneComponent', () => {
  let component: DevisSigneComponent;
  let fixture: ComponentFixture<DevisSigneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevisSigneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevisSigneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
