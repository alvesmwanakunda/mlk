import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockModuleComponent } from './stock-module.component';

describe('StockModuleComponent', () => {
  let component: StockModuleComponent;
  let fixture: ComponentFixture<StockModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockModuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
