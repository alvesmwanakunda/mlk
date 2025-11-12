import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteNoteModuleComponent } from './delete-note-module.component';

describe('DeleteNoteModuleComponent', () => {
  let component: DeleteNoteModuleComponent;
  let fixture: ComponentFixture<DeleteNoteModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteNoteModuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteNoteModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
