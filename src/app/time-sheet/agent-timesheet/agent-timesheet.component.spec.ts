import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentTimesheetComponent } from './agent-timesheet.component';

describe('AgentTimesheetComponent', () => {
  let component: AgentTimesheetComponent;
  let fixture: ComponentFixture<AgentTimesheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentTimesheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
