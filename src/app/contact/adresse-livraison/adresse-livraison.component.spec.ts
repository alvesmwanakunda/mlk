import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdresseLivraisonComponent } from './adresse-livraison.component';

describe('AdresseLivraisonComponent', () => {
  let component: AdresseLivraisonComponent;
  let fixture: ComponentFixture<AdresseLivraisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdresseLivraisonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdresseLivraisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
