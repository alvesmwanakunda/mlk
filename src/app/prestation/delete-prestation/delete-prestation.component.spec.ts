import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePrestationComponent } from './delete-prestation.component';

describe('DeletePrestationComponent', () => {
  let component: DeletePrestationComponent;
  let fixture: ComponentFixture<DeletePrestationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletePrestationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletePrestationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
