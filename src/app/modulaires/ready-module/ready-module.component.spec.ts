import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadyModuleComponent } from './ready-module.component';

describe('ReadyModuleComponent', () => {
  let component: ReadyModuleComponent;
  let fixture: ComponentFixture<ReadyModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadyModuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadyModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
