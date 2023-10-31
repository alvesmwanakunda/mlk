import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Plan3dRoutingModule } from './plan3d-routing.module';
import { SharedModule } from '../shared/shared.module';
import { Plan3dComponent } from './plan3d.component';


@NgModule({
  declarations: [Plan3dComponent],
  imports: [
    CommonModule,
    Plan3dRoutingModule,
    SharedModule
  ]
})
export class Plan3dModule { }
