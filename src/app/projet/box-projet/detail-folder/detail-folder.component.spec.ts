import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailFolderComponent } from './detail-folder.component';

describe('DetailFolderComponent', () => {
  let component: DetailFolderComponent;
  let fixture: ComponentFixture<DetailFolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailFolderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
