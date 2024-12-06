import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteProduitPrestaComponent } from './delete-produit-presta.component';

describe('DeleteProduitPrestaComponent', () => {
  let component: DeleteProduitPrestaComponent;
  let fixture: ComponentFixture<DeleteProduitPrestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteProduitPrestaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteProduitPrestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
