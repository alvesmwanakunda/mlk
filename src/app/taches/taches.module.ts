import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TachesRoutingModule } from './taches-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TachesService } from '../shared/services/taches.service';
import { TachesComponent } from './taches.component';
import { AddTachesModule } from './add-taches/add-taches.module';
import { UpdateTachesModule } from './update-taches/update-taches.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { TaskPlanModule } from './task-plan/task-plan.module';



@NgModule({
  declarations: [TachesComponent,],
  imports: [
    CommonModule,
    TachesRoutingModule,
    SharedModule,
    AddTachesModule,
    UpdateTachesModule,
    PdfViewerModule,
    TaskPlanModule
  ],
  providers: [TachesService],
  exports: [TachesComponent]
})
export class TachesModule { }
