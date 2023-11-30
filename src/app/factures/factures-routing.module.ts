import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacturesComponent } from './factures.component';
import { AuthGuardService } from '../shared/services/auth-guard.service';


const routes: Routes = [{
  path:'',
  component:FacturesComponent,
  canActivate:[AuthGuardService]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturesRoutingModule { }
