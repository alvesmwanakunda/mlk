import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUpdateTimesheetComponent } from './dialog-update-timesheet.component';

describe('DialogUpdateTimesheetComponent', () => {
  let component: DialogUpdateTimesheetComponent;
  let fixture: ComponentFixture<DialogUpdateTimesheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogUpdateTimesheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogUpdateTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
