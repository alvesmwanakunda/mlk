import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTransporteurComponent } from './add-transporteur.component';

describe('AddTransporteurComponent', () => {
  let component: AddTransporteurComponent;
  let fixture: ComponentFixture<AddTransporteurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTransporteurComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTransporteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
