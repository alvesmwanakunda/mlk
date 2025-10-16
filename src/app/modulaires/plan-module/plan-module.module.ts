import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { PlanModuleComponent } from './plan-module.component';
import { DetailPlanModuleModule } from './detail-plan-module/detail-plan-module.module';
import { MovePlanModule } from './move-plan/move-plan.module';



@NgModule({
  declarations: [PlanModuleComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DetailPlanModuleModule,
    MovePlanModule
  ],
  exports:[PlanModuleComponent]
})
export class PlanModuleModule { }
