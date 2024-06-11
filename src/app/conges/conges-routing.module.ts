import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CongesComponent } from './conges.component';
import { AuthGuardService } from '../shared/services/auth-guard.service';

const routes: Routes = [{
  path: '',
  component: CongesComponent,
  canActivate: [AuthGuardService]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CongesRoutingModule { }
