import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchEntrepriseComponent } from './search-entreprise.component';

describe('SearchEntrepriseComponent', () => {
  let component: SearchEntrepriseComponent;
  let fixture: ComponentFixture<SearchEntrepriseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchEntrepriseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchEntrepriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
