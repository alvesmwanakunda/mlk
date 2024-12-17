import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfFicheTechniqueComponent } from './pdf-fiche-technique.component';

describe('PdfFicheTechniqueComponent', () => {
  let component: PdfFicheTechniqueComponent;
  let fixture: ComponentFixture<PdfFicheTechniqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfFicheTechniqueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfFicheTechniqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
