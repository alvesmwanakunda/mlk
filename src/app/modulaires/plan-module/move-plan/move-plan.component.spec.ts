import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovePlanComponent } from './move-plan.component';

describe('MovePlanComponent', () => {
  let component: MovePlanComponent;
  let fixture: ComponentFixture<MovePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovePlanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
