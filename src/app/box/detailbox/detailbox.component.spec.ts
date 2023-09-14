import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailboxComponent } from './detailbox.component';

describe('DetailboxComponent', () => {
  let component: DetailboxComponent;
  let fixture: ComponentFixture<DetailboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailboxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
