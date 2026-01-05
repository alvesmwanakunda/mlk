import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTachesComponent } from './sub-taches.component';

describe('SubTachesComponent', () => {
  let component: SubTachesComponent;
  let fixture: ComponentFixture<SubTachesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubTachesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubTachesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
