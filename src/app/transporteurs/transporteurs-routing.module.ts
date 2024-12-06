import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransporteursComponent } from './transporteurs.component';
import { AuthGuardService } from '../shared/services/auth-guard.service';


const routes: Routes = [{
    path: '',
    component: TransporteursComponent,
    canActivate: [AuthGuardService]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransporteursRoutingModule { }
