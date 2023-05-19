import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetreComponent } from './metre.component';

describe('MetreComponent', () => {
  let component: MetreComponent;
  let fixture: ComponentFixture<MetreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
