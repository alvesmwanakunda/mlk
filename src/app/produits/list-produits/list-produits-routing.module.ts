import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListProduitsComponent } from './list-produits.component';
import { AuthGuardService } from '../../shared/services/auth-guard.service';


const routes: Routes = [{
  path:'',
  component:ListProduitsComponent,
  canActivate:[AuthGuardService],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListProduitsRoutingModule { }
