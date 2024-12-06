import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProduitPrestaComponent } from './add-produit-presta.component';

describe('AddProduitPrestaComponent', () => {
  let component: AddProduitPrestaComponent;
  let fixture: ComponentFixture<AddProduitPrestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProduitPrestaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProduitPrestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
