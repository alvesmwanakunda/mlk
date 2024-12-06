import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockProjetComponent } from './stock-projet.component';

describe('StockProjetComponent', () => {
  let component: StockProjetComponent;
  let fixture: ComponentFixture<StockProjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockProjetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
