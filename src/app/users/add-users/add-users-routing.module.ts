import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUsersComponent } from './add-users.component';
import { AuthGuardService } from '../../shared/services/auth-guard.service';


const routes: Routes = [{
  path: '',
  component: AddUsersComponent,
  canActivate: [AuthGuardService]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddUsersRoutingModule { }
