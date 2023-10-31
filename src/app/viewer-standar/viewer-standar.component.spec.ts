import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerStandarComponent } from './viewer-standar.component';

describe('ViewerStandarComponent', () => {
  let component: ViewerStandarComponent;
  let fixture: ComponentFixture<ViewerStandarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerStandarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewerStandarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
