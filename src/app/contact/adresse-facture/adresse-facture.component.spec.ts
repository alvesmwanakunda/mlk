import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdresseFactureComponent } from './adresse-facture.component';

describe('AdresseFactureComponent', () => {
  let component: AdresseFactureComponent;
  let fixture: ComponentFixture<AdresseFactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdresseFactureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdresseFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
