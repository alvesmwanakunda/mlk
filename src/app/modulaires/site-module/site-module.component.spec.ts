import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteModuleComponent } from './site-module.component';

describe('SiteModuleComponent', () => {
  let component: SiteModuleComponent;
  let fixture: ComponentFixture<SiteModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiteModuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
