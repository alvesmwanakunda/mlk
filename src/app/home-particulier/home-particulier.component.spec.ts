import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeParticulierComponent } from './home-particulier.component';

describe('HomeParticulierComponent', () => {
  let component: HomeParticulierComponent;
  let fixture: ComponentFixture<HomeParticulierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeParticulierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeParticulierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
