import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTransporteurComponent } from './add-transporteur.component';
import { AuthGuardService } from '../../shared/services/auth-guard.service';


const routes: Routes = [
  {
    path: '',
    component: AddTransporteurComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddTransporteurRoutingModule { }
