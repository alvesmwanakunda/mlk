import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAgendaComponent } from './detail-agenda.component';

describe('DetailAgendaComponent', () => {
  let component: DetailAgendaComponent;
  let fixture: ComponentFixture<DetailAgendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailAgendaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
