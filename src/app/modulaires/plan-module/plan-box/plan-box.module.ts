import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlanBoxComponent } from './plan-box.component';
import { ProjetsService } from 'src/app/shared/services/projets.service';



@NgModule({
  declarations: [PlanBoxComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers:[ProjetsService],
  exports:[PlanBoxComponent]
})
export class PlanBoxModule { }
