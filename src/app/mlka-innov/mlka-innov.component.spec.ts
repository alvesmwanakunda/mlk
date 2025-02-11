import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MlkaInnovComponent } from './mlka-innov.component';

describe('MlkaInnovComponent', () => {
  let component: MlkaInnovComponent;
  let fixture: ComponentFixture<MlkaInnovComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MlkaInnovComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MlkaInnovComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
