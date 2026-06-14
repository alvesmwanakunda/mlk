import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SharedModule } from 'src/app/shared/shared.module';
import { TaskPlanMarkerPreviewComponent } from '../task-plan-marker-preview/task-plan-marker-preview.component';
import { TaskPlanComponent } from './task-plan.component';

@NgModule({
  declarations: [
    TaskPlanComponent,
    TaskPlanMarkerPreviewComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PdfViewerModule
  ],
  exports: [
    TaskPlanComponent,
    TaskPlanMarkerPreviewComponent
  ]
})
export class TaskPlanModule { }
