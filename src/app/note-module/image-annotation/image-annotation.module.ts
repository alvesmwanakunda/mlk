import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageAnnotationComponent } from './image-annotation.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';




@NgModule({
  declarations: [ImageAnnotationComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
  ],
  exports:[ImageAnnotationComponent]
})
export class ImageAnnotationModule { }
