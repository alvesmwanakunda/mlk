import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueModuleComponent } from './historique-module.component';

describe('HistoriqueModuleComponent', () => {
  let component: HistoriqueModuleComponent;
  let fixture: ComponentFixture<HistoriqueModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoriqueModuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriqueModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
