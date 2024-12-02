import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionModuleComponent } from './description-module.component';

describe('DescriptionModuleComponent', () => {
  let component: DescriptionModuleComponent;
  let fixture: ComponentFixture<DescriptionModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescriptionModuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescriptionModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
