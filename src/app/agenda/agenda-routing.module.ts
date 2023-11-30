import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgendaComponent } from './agenda.component';
import { AuthGuardService } from '../shared/services/auth-guard.service';


const routes: Routes = [{
  path: '',
  component: AgendaComponent,
  canActivateChild: [AuthGuardService],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgendaRoutingModule { }
