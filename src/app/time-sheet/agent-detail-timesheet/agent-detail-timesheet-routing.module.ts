import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentDetailTimesheetComponent } from './agent-detail-timesheet.component';
import { AuthGuardService } from '../../shared/services/auth-guard.service';


const routes: Routes = [{
  path: '',
  component: AgentDetailTimesheetComponent,
  canActivate: [AuthGuardService]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentDetailTimesheetRoutingModule { }
