import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentDetailTimesheetComponent } from './agent-detail-timesheet.component';

describe('AgentDetailTimesheetComponent', () => {
  let component: AgentDetailTimesheetComponent;
  let fixture: ComponentFixture<AgentDetailTimesheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentDetailTimesheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentDetailTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
