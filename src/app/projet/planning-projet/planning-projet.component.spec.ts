import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningProjetComponent } from './planning-projet.component';

describe('PlanningProjetComponent', () => {
  let component: PlanningProjetComponent;
  let fixture: ComponentFixture<PlanningProjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanningProjetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanningProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
