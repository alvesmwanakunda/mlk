import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdteNoteModuleComponent } from './updte-note-module.component';

describe('UpdteNoteModuleComponent', () => {
  let component: UpdteNoteModuleComponent;
  let fixture: ComponentFixture<UpdteNoteModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdteNoteModuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdteNoteModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
