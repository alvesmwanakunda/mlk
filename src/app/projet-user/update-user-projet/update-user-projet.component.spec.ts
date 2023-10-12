import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUserProjetComponent } from './update-user-projet.component';

describe('UpdateUserProjetComponent', () => {
  let component: UpdateUserProjetComponent;
  let fixture: ComponentFixture<UpdateUserProjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateUserProjetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateUserProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
