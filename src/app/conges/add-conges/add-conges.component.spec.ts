import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCongesComponent } from './add-conges.component';

describe('AddCongesComponent', () => {
  let component: AddCongesComponent;
  let fixture: ComponentFixture<AddCongesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCongesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCongesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
