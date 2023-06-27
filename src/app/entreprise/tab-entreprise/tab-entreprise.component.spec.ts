import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabEntrepriseComponent } from './tab-entreprise.component';

describe('TabEntrepriseComponent', () => {
  let component: TabEntrepriseComponent;
  let fixture: ComponentFixture<TabEntrepriseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabEntrepriseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabEntrepriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
