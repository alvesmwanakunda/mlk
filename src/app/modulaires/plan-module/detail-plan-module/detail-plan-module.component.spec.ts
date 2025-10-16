import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPlanModuleComponent } from './detail-plan-module.component';

describe('DetailPlanModuleComponent', () => {
  let component: DetailPlanModuleComponent;
  let fixture: ComponentFixture<DetailPlanModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailPlanModuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailPlanModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
