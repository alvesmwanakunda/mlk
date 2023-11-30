import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteFactureComponent } from './delete-facture.component';

describe('DeleteFactureComponent', () => {
  let component: DeleteFactureComponent;
  let fixture: ComponentFixture<DeleteFactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteFactureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
