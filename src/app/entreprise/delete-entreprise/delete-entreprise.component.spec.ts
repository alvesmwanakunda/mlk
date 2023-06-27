import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteEntrepriseComponent } from './delete-entreprise.component';

describe('DeleteEntrepriseComponent', () => {
  let component: DeleteEntrepriseComponent;
  let fixture: ComponentFixture<DeleteEntrepriseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteEntrepriseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteEntrepriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
