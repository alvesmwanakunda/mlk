import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApercuTimesheetComponent } from './apercu-timesheet.component';
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: ApercuTimesheetComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApercuTimesheetRoutingModule { }
