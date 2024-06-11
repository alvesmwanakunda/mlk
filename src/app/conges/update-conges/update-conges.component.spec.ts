import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCongesComponent } from './update-conges.component';

describe('UpdateCongesComponent', () => {
  let component: UpdateCongesComponent;
  let fixture: ComponentFixture<UpdateCongesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCongesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCongesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
