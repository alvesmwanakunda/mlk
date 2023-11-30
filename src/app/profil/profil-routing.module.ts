import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilComponent } from './profil.component';
import { AuthGuardService } from '../shared/services/auth-guard.service';


const routes: Routes = [{
  path:'',
  component:ProfilComponent,
  canActivate:[AuthGuardService]
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfilRoutingModule { }
