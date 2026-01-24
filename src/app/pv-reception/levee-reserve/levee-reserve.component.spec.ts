import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeveeReserveComponent } from './levee-reserve.component';

describe('LeveeReserveComponent', () => {
  let component: LeveeReserveComponent;
  let fixture: ComponentFixture<LeveeReserveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeveeReserveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeveeReserveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
