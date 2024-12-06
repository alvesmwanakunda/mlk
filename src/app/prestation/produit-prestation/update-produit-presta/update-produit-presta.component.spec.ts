import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProduitPrestaComponent } from './update-produit-presta.component';

describe('UpdateProduitPrestaComponent', () => {
  let component: UpdateProduitPrestaComponent;
  let fixture: ComponentFixture<UpdateProduitPrestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateProduitPrestaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateProduitPrestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
