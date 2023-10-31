import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulairesComponent } from './modulaires.component';

describe('ModulairesComponent', () => {
  let component: ModulairesComponent;
  let fixture: ComponentFixture<ModulairesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModulairesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModulairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
