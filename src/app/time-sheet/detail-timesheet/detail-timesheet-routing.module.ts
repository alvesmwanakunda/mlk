import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailTimesheetComponent } from './detail-timesheet.component';
import { AuthGuardService } from '../../shared/services/auth-guard.service';


const routes: Routes = [
  {
    path: '',
    component: DetailTimesheetComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailTimesheetRoutingModule { }
