import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetUserComponent } from './projet-user.component';

describe('ProjetUserComponent', () => {
  let component: ProjetUserComponent;
  let fixture: ComponentFixture<ProjetUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjetUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjetUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
