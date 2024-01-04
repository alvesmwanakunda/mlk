import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateModuleComponent } from './update-module.component';
import { UpdateModuleRoutingModule } from './update-module-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NavbarModule } from '../../navbar/navbar.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewerStandarModule } from 'src/app/viewer-standar/viewer-standar.module';
import { PositionModule } from '../position/position.module';
import { HistoriqueModuleModule } from '../historique-module/historique-module.module';
import { PlanModuleModule } from '../plan-module/plan-module.module';


@NgModule({
  declarations: [UpdateModuleComponent],
  imports: [
    CommonModule,
    UpdateModuleRoutingModule,
    SharedModule,
    NavbarModule,
    FormsModule,
    ReactiveFormsModule,
    ViewerStandarModule,
    PositionModule,
    HistoriqueModuleModule,
    PlanModuleModule
  ]
})
export class UpdateModuleModule { }
