import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentTimesheetComponent } from './agent-timesheet.component';
import { AuthGuardService } from '../../shared/services/auth-guard.service';


const routes: Routes = [{
  path: '',
  component: AgentTimesheetComponent,
  canActivate: [AuthGuardService]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentTimesheetRoutingModule { }
