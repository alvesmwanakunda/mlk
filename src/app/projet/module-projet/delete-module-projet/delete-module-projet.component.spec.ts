import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteModuleProjetComponent } from './delete-module-projet.component';

describe('DeleteModuleProjetComponent', () => {
  let component: DeleteModuleProjetComponent;
  let fixture: ComponentFixture<DeleteModuleProjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteModuleProjetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteModuleProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
