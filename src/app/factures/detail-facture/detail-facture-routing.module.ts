import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailFactureComponent } from './detail-facture.component';
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: DetailFactureComponent,
    canActivate:[AuthGuardService]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailFactureRoutingModule { }
