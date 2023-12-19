import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../shared/services/auth-guard.service';
import { AddDevisComponent } from './add-devis.component';


const routes: Routes = [{
  path:'',
  component:AddDevisComponent,
  canActivate:[AuthGuardService]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddDevisRoutingModule { }
