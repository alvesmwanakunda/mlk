import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteModuleComponent } from './note-module.component';

describe('NoteModuleComponent', () => {
  let component: NoteModuleComponent;
  let fixture: ComponentFixture<NoteModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoteModuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
