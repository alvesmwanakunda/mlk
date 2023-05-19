import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailEntrepriseComponent } from './detail-entreprise.component';

describe('DetailEntrepriseComponent', () => {
  let component: DetailEntrepriseComponent;
  let fixture: ComponentFixture<DetailEntrepriseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailEntrepriseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailEntrepriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
