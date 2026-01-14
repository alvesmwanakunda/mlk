import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePvComponent } from './delete-pv.component';

describe('DeletePvComponent', () => {
  let component: DeletePvComponent;
  let fixture: ComponentFixture<DeletePvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletePvComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletePvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
