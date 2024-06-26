import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTimesheetComponent } from './delete-timesheet.component';

describe('DeleteTimesheetComponent', () => {
  let component: DeleteTimesheetComponent;
  let fixture: ComponentFixture<DeleteTimesheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteTimesheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
