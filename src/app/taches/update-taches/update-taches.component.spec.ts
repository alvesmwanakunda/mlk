import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTachesComponent } from './update-taches.component';

describe('UpdateTachesComponent', () => {
  let component: UpdateTachesComponent;
  let fixture: ComponentFixture<UpdateTachesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateTachesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateTachesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
