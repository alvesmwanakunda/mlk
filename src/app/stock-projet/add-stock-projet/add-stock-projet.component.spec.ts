import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStockProjetComponent } from './add-stock-projet.component';

describe('AddStockProjetComponent', () => {
  let component: AddStockProjetComponent;
  let fixture: ComponentFixture<AddStockProjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddStockProjetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddStockProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
