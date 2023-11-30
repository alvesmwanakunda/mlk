import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevisProjetComponent } from './devis-projet.component';

describe('DevisProjetComponent', () => {
  let component: DevisProjetComponent;
  let fixture: ComponentFixture<DevisProjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevisProjetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevisProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
