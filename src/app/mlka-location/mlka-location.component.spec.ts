import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MlkaLocationComponent } from './mlka-location.component';

describe('MlkaLocationComponent', () => {
  let component: MlkaLocationComponent;
  let fixture: ComponentFixture<MlkaLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MlkaLocationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MlkaLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
