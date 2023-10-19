import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardUserComponent } from './dashboard-user.component';
import { DashboardUserRoutingModule } from './dashboard-user-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ProjetsService } from '../shared/services/projets.service';
import { NavbarModule } from '../navbar/navbar.module';


@NgModule({
  declarations: [DashboardUserComponent],
  imports: [
    CommonModule,
    DashboardUserRoutingModule,
    SharedModule,
    NavbarModule
  ],
  providers:[ProjetsService]
})
export class DashboardUserModule { }
