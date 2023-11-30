import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDevisComponent } from './delete-devis.component';

describe('DeleteDevisComponent', () => {
  let component: DeleteDevisComponent;
  let fixture: ComponentFixture<DeleteDevisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteDevisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteDevisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
