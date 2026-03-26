import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddReceptionComponent } from './add-reception.component';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ViewerStandarModule } from 'src/app/viewer-standar/viewer-standar.module';
import { ImageAnnotationModule } from '../../note-module/image-annotation/image-annotation.module';



@NgModule({
  declarations: [AddReceptionComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule, FormsModule,
    ViewerStandarModule, ImageAnnotationModule
  ],
  exports: [AddReceptionComponent]
})
export class AddReceptionModule { }
