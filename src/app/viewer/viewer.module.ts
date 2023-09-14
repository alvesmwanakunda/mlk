import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ViewerComponent } from './viewer.component';
import { BoxService } from '../shared/services/box.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';


@NgModule({
  declarations: [ViewerComponent],
  imports: [
    CommonModule,
    SharedModule,
    PdfViewerModule
  ],
  providers:[BoxService]
})
export class ViewerModule { }
