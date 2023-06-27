import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetEntrepriseComponent } from './projet-entreprise.component';

describe('ProjetEntrepriseComponent', () => {
  let component: ProjetEntrepriseComponent;
  let fixture: ComponentFixture<ProjetEntrepriseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjetEntrepriseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjetEntrepriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
