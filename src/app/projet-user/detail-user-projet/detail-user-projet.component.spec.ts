import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailUserProjetComponent } from './detail-user-projet.component';

describe('DetailUserProjetComponent', () => {
  let component: DetailUserProjetComponent;
  let fixture: ComponentFixture<DetailUserProjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailUserProjetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailUserProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
