import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTachesComponent } from './delete-taches.component';

describe('DeleteTachesComponent', () => {
  let component: DeleteTachesComponent;
  let fixture: ComponentFixture<DeleteTachesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteTachesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteTachesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
