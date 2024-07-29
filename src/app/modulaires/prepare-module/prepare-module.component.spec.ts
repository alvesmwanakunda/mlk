import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareModuleComponent } from './prepare-module.component';

describe('PrepareModuleComponent', () => {
  let component: PrepareModuleComponent;
  let fixture: ComponentFixture<PrepareModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrepareModuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrepareModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
