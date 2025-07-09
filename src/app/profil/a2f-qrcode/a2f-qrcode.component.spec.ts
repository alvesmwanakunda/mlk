import { ComponentFixture, TestBed } from '@angular/core/testing';

import { A2fQrcodeComponent } from './a2f-qrcode.component';

describe('A2fQrcodeComponent', () => {
  let component: A2fQrcodeComponent;
  let fixture: ComponentFixture<A2fQrcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ A2fQrcodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(A2fQrcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
