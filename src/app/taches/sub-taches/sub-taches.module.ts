import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { SubTachesComponent } from './sub-taches.component';
import { ImageAnnotationModule } from 'src/app/note-module/image-annotation/image-annotation.module';
import { ViewerStandarModule } from 'src/app/viewer-standar/viewer-standar.module';




@NgModule({
  declarations: [SubTachesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ImageAnnotationModule,
    ViewerStandarModule
  ],
  exports:[SubTachesComponent]
})
export class SubTachesModule { }
