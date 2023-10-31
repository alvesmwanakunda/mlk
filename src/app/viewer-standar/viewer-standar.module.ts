import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewerStandarComponent } from './viewer-standar.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SharedModule } from '../shared/shared.module';




@NgModule({
  declarations: [ViewerStandarComponent],
  imports: [
    CommonModule,
    SharedModule,
    PdfViewerModule
  ]
})
export class ViewerStandarModule { }
