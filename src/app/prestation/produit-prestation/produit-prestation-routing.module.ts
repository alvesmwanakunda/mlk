import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProduitPrestationComponent } from './produit-prestation.component';
import { AuthGuardService } from '../../shared/services/auth-guard.service';


const routes: Routes = [{
  path: '',
  component: ProduitPrestationComponent,
  canActivate: [AuthGuardService]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProduitPrestationRoutingModule { }
