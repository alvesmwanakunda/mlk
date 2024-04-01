import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleProjetComponent } from './module-projet.component';

describe('ModuleProjetComponent', () => {
  let component: ModuleProjetComponent;
  let fixture: ComponentFixture<ModuleProjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleProjetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuleProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
