import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../shared/services/auth-guard.service';
import { UpdateDevisComponent } from './update-devis.component';


const routes: Routes = [{
  path:'',
  component:UpdateDevisComponent,
  canActivate:[AuthGuardService]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdateDevisRoutingModule { }
