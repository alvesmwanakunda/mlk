import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodeModuleComponent } from './qrcode-module.component';

describe('QrcodeModuleComponent', () => {
  let component: QrcodeModuleComponent;
  let fixture: ComponentFixture<QrcodeModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrcodeModuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrcodeModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
