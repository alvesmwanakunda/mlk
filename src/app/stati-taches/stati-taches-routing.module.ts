import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatiTachesComponent } from './stati-taches.component';
import { AuthGuardService } from '../shared/services/auth-guard.service';


const routes: Routes = [{
  path:'',
  component:StatiTachesComponent,
  canActivate:[AuthGuardService],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatiTachesRoutingModule { }
