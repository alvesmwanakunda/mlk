import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceTaskComponent } from './voice-task.component';

describe('VoiceTaskComponent', () => {
  let component: VoiceTaskComponent;
  let fixture: ComponentFixture<VoiceTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoiceTaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoiceTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
