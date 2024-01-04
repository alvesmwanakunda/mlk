import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateHistoriqueComponent } from './update-historique.component';

describe('UpdateHistoriqueComponent', () => {
  let component: UpdateHistoriqueComponent;
  let fixture: ComponentFixture<UpdateHistoriqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateHistoriqueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateHistoriqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
