import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPvComponent } from './detail-pv.component';

describe('DetailPvComponent', () => {
  let component: DetailPvComponent;
  let fixture: ComponentFixture<DetailPvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailPvComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailPvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
