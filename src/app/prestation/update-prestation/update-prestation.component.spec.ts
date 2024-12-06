import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePrestationComponent } from './update-prestation.component';

describe('UpdatePrestationComponent', () => {
  let component: UpdatePrestationComponent;
  let fixture: ComponentFixture<UpdatePrestationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePrestationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePrestationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
