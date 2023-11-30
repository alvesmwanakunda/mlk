import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddContactComponent } from './add-contact.component';
import { AuthGuardService } from '../../shared/services/auth-guard.service';


const routes: Routes = [{
  path: '',
  component:AddContactComponent,
  canActivate:[AuthGuardService]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddContactRoutingModule { }
