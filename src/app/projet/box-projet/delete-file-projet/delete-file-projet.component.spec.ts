import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteFileProjetComponent } from './delete-file-projet.component';

describe('DeleteFileProjetComponent', () => {
  let component: DeleteFileProjetComponent;
  let fixture: ComponentFixture<DeleteFileProjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteFileProjetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteFileProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
