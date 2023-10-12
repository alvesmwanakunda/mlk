import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardUserComponent } from './dashboard-user.component';
import { DashboardUserRoutingModule } from './dashboard-user-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ProjetsService } from '../shared/services/projets.service';
import { NavbarUserModule } from '../navbar-user/navbar-user.module';


@NgModule({
  declarations: [DashboardUserComponent],
  imports: [
    CommonModule,
    DashboardUserRoutingModule,
    SharedModule,
    NavbarUserModule
  ],
  providers:[ProjetsService]
})
export class DashboardUserModule { }
