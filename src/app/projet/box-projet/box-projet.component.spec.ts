import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxProjetComponent } from './box-projet.component';

describe('BoxProjetComponent', () => {
  let component: BoxProjetComponent;
  let fixture: ComponentFixture<BoxProjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoxProjetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoxProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
