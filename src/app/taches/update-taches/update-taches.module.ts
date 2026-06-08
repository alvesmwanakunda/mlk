import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { UpdateTachesComponent } from './update-taches.component';
import { DeleteTachesModule } from '../delete-taches/delete-taches.module';
import { ImageAnnotationModule } from 'src/app/note-module/image-annotation/image-annotation.module';
import { SubTachesModule } from '../sub-taches/sub-taches.module';
import { ViewerStandarModule } from 'src/app/viewer-standar/viewer-standar.module';
import { TaskPlanModule } from '../task-plan/task-plan.module';




@NgModule({
  declarations: [UpdateTachesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DeleteTachesModule,
    ImageAnnotationModule,
    SubTachesModule,
    ViewerStandarModule,
    TaskPlanModule
  ]
})
export class UpdateTachesModule { }
