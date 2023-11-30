import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModulairesComponent } from './modulaires.component';
import { AuthGuardService } from '../shared/services/auth-guard.service';


const routes: Routes = [{
  path:'',
  component:ModulairesComponent,
  canActivate:[AuthGuardService],
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulairesRoutingModule { }
