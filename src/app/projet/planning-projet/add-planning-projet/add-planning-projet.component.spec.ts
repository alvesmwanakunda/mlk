import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlanningProjetComponent } from './add-planning-projet.component';

describe('AddPlanningProjetComponent', () => {
  let component: AddPlanningProjetComponent;
  let fixture: ComponentFixture<AddPlanningProjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPlanningProjetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPlanningProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
