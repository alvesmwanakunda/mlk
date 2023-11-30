import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveFolderProjetComponent } from './move-folder-projet.component';

describe('MoveFolderProjetComponent', () => {
  let component: MoveFolderProjetComponent;
  let fixture: ComponentFixture<MoveFolderProjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveFolderProjetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoveFolderProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
