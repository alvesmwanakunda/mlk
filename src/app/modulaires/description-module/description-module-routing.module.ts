import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../shared/services/auth-guard.service';
import { DescriptionModuleComponent } from './description-module.component';


const routes: Routes = [
  {
    path:'',
    component:DescriptionModuleComponent,
    canActivate:[AuthGuardService],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DescriptionModuleRoutingModule { }
