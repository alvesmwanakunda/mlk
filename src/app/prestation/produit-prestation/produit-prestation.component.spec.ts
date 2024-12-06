import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitPrestationComponent } from './produit-prestation.component';

describe('ProduitPrestationComponent', () => {
  let component: ProduitPrestationComponent;
  let fixture: ComponentFixture<ProduitPrestationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProduitPrestationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProduitPrestationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
