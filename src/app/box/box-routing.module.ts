import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoxComponent } from './box.component';
import { AuthGuardService } from '../shared/services/auth-guard.service';


const routes: Routes = [{
  path:'',
  component:BoxComponent,
  canActivate:[AuthGuardService]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoxRoutingModule { }
