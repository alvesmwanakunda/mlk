import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { PdfFicheTechniqueComponent } from './pdf-fiche-technique.component';




@NgModule({
  declarations: [PdfFicheTechniqueComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[PdfFicheTechniqueComponent]
})
export class PdfFicheTechniqueModule { }
