import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTimesheetComponent } from './detail-timesheet.component';

describe('DetailTimesheetComponent', () => {
  let component: DetailTimesheetComponent;
  let fixture: ComponentFixture<DetailTimesheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailTimesheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
