import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MlkaGroupeComponent } from './mlka-groupe.component';

describe('MlkaGroupeComponent', () => {
  let component: MlkaGroupeComponent;
  let fixture: ComponentFixture<MlkaGroupeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MlkaGroupeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MlkaGroupeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
