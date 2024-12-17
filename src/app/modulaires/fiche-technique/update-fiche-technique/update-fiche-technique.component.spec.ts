import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFicheTechniqueComponent } from './update-fiche-technique.component';

describe('UpdateFicheTechniqueComponent', () => {
  let component: UpdateFicheTechniqueComponent;
  let fixture: ComponentFixture<UpdateFicheTechniqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateFicheTechniqueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateFicheTechniqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
