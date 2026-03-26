import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReceptionComponent } from './add-reception.component';

describe('AddReceptionComponent', () => {
  let component: AddReceptionComponent;
  let fixture: ComponentFixture<AddReceptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddReceptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
