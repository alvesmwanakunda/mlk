import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardUserComponent } from './dashboard-user.component';
import { AuthGuardService } from '../shared/services/auth-guard.service';


const routes: Routes = [{
  path:'',
  component: DashboardUserComponent,
  canActivate:[AuthGuardService]
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardUserRoutingModule { }
