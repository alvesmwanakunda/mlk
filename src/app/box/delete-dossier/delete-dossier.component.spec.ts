import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDossierComponent } from './delete-dossier.component';

describe('DeleteDossierComponent', () => {
  let component: DeleteDossierComponent;
  let fixture: ComponentFixture<DeleteDossierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteDossierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteDossierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
