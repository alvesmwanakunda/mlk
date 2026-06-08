import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddTachesComponent } from './add-taches.component';
import { ImageAnnotationModule } from 'src/app/note-module/image-annotation/image-annotation.module';
import { TaskPlanModule } from '../task-plan/task-plan.module';



@NgModule({
  declarations: [AddTachesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ImageAnnotationModule,
    TaskPlanModule
  ]
})
export class AddTachesModule { }
