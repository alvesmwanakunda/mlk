import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DevisPdfComponent } from './devis-pdf.component';
import { AuthGuardService } from '../../shared/services/auth-guard.service';


const routes: Routes = [
  {
    path: '',
    component: DevisPdfComponent,
    canActivate:[AuthGuardService]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevisPdfRoutingModule { }
