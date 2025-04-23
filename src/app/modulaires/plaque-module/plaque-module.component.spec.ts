import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaqueModuleComponent } from './plaque-module.component';

describe('PlaqueModuleComponent', () => {
  let component: PlaqueModuleComponent;
  let fixture: ComponentFixture<PlaqueModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaqueModuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaqueModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
