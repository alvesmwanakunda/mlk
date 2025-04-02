import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApercuTimesheetComponent } from './apercu-timesheet.component';

describe('ApercuTimesheetComponent', () => {
  let component: ApercuTimesheetComponent;
  let fixture: ComponentFixture<ApercuTimesheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApercuTimesheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApercuTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
