import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntrepriseComponent } from './entreprise.component';
import { AuthGuardService } from '../shared/services/auth-guard.service';


const routes: Routes = [{
  path:'',
  component:EntrepriseComponent,
  canActivate:[AuthGuardService],
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntrepriseRoutingModule { }
