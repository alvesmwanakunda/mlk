import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../shared/services/auth-guard.service';
import { UpdateCongesComponent } from './update-conges.component';

const routes: Routes = [{
  path: '',
  component: UpdateCongesComponent,
  canActivate: [AuthGuardService]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdateCongesRoutingModule { }
