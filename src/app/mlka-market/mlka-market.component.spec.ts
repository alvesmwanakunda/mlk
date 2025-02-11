import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MlkaMarketComponent } from './mlka-market.component';

describe('MlkaMarketComponent', () => {
  let component: MlkaMarketComponent;
  let fixture: ComponentFixture<MlkaMarketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MlkaMarketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MlkaMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
