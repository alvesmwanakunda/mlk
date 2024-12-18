import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { UpdateFicheTechniqueComponent } from './update-fiche-technique.component';
import { PdfFicheTechniqueModule } from '../pdf-fiche-technique/pdf-fiche-technique.module';





@NgModule({
  declarations: [UpdateFicheTechniqueComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PdfFicheTechniqueModule
  ],
  exports: [UpdateFicheTechniqueComponent]
})
export class UpdateFicheTechniqueModule { }
