import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscrireNoteComponent } from './transcrire-note.component';

describe('TranscrireNoteComponent', () => {
  let component: TranscrireNoteComponent;
  let fixture: ComponentFixture<TranscrireNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TranscrireNoteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TranscrireNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
