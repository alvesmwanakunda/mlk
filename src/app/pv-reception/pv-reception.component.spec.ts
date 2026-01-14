import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PvReceptionComponent } from './pv-reception.component';

describe('PvReceptionComponent', () => {
  let component: PvReceptionComponent;
  let fixture: ComponentFixture<PvReceptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PvReceptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PvReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
