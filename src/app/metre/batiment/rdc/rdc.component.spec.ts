import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdcComponent } from './rdc.component';

describe('RdcComponent', () => {
  let component: RdcComponent;
  let fixture: ComponentFixture<RdcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RdcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RdcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
