import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTachesComponent } from './add-taches.component';

describe('AddTachesComponent', () => {
  let component: AddTachesComponent;
  let fixture: ComponentFixture<AddTachesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTachesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTachesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
