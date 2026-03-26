import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DetailPvComponent } from './detail-pv.component';
import { ViewerStandarModule } from 'src/app/viewer-standar/viewer-standar.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ImageAnnotationModule } from 'src/app/note-module/image-annotation/image-annotation.module';
import { SendmailPvModule } from '../sendmail-pv/sendmail-pv.module';




@NgModule({
  declarations: [DetailPvComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    ViewerStandarModule,
    MatDialogModule,
    ImageAnnotationModule,
    SendmailPvModule
  ],
  exports:[DetailPvComponent]
})
export class DetailPvModule { }
