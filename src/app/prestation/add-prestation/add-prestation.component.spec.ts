import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPrestationComponent } from './add-prestation.component';

describe('AddPrestationComponent', () => {
  let component: AddPrestationComponent;
  let fixture: ComponentFixture<AddPrestationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPrestationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPrestationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
