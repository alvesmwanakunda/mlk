import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdateUserProjetComponent } from './update-user-projet.component';

const routes: Routes = [{
  path:'',
  component:UpdateUserProjetComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdateUserProjetRoutingModule { }
