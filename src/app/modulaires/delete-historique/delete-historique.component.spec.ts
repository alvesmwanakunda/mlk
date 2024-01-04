import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteHistoriqueComponent } from './delete-historique.component';

describe('DeleteHistoriqueComponent', () => {
  let component: DeleteHistoriqueComponent;
  let fixture: ComponentFixture<DeleteHistoriqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteHistoriqueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteHistoriqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
