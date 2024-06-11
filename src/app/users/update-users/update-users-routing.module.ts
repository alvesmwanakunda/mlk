import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdateUsersComponent } from './update-users.component';
import { AuthGuardService } from '../../shared/services/auth-guard.service';


const routes: Routes = [{
    path: '',
    component: UpdateUsersComponent,
    canActivate: [AuthGuardService]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdateUsersRoutingModule { }
