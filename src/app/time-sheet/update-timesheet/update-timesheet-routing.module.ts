import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdateTimesheetComponent } from './update-timesheet.component';
import { AuthGuardService } from '../../shared/services/auth-guard.service';


const routes: Routes = [{
    path: '',
    component: UpdateTimesheetComponent,
    canActivate: [AuthGuardService]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdateTimesheetRoutingModule { }
