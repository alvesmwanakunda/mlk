import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransporteursComponent } from './transporteurs.component';

describe('TransporteursComponent', () => {
  let component: TransporteursComponent;
  let fixture: ComponentFixture<TransporteursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransporteursComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransporteursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
