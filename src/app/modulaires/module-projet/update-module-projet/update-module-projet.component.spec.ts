import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateModuleProjetComponent } from './update-module-projet.component';

describe('UpdateModuleProjetComponent', () => {
  let component: UpdateModuleProjetComponent;
  let fixture: ComponentFixture<UpdateModuleProjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateModuleProjetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateModuleProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
