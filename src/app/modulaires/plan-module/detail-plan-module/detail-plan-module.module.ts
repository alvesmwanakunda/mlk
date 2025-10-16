import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { BoxService } from '../../../shared/services/box.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewerModule } from '../../../viewer/viewer.module';
import { BreadcrumbService } from '../../../shared/services/breadcrumb.service';
//import { FileBoxModule } from 'src/app/projet/box-projet/file-box/file-box.module';
import { DetailPlanModuleComponent } from './detail-plan-module.component';
import { PlanBoxModule } from '../plan-box/plan-box.module';
import { ViewerStandarModule } from 'src/app/viewer-standar/viewer-standar.module';
import { MovePlanModule } from '../move-plan/move-plan.module';




@NgModule({
  declarations: [DetailPlanModuleComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ViewerModule,
    PlanBoxModule,
    ViewerStandarModule,
    MovePlanModule
  ],
  providers:[BoxService, BreadcrumbService],
  exports:[DetailPlanModuleComponent]

})
export class DetailPlanModuleModule { }
