import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatiTachesComponent } from './stati-taches.component';

describe('StatiTachesComponent', () => {
  let component: StatiTachesComponent;
  let fixture: ComponentFixture<StatiTachesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatiTachesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatiTachesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
