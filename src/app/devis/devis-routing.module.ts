import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DevisComponent } from './devis.component';
import { AuthGuardService } from '../shared/services/auth-guard.service';


const routes: Routes = [{
  path:'',
  component:DevisComponent,
  canActivate:[AuthGuardService]
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevisRoutingModule { }
