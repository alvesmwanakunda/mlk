import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCongesComponent } from './add-conges.component';
import { AuthGuardService } from '../../shared/services/auth-guard.service';


const routes: Routes = [
  {
    path:'',
    component:AddCongesComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCongesRoutingModule { }
