import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ViewerStandarModule } from 'src/app/viewer-standar/viewer-standar.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ImageAnnotationModule } from 'src/app/note-module/image-annotation/image-annotation.module';
import { LeveeReserveComponent } from './levee-reserve.component';



@NgModule({
  declarations: [LeveeReserveComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    ViewerStandarModule,
    MatDialogModule,
    ImageAnnotationModule
  ],
  exports:[LeveeReserveComponent]
})
export class LeveeReserveModule { }
