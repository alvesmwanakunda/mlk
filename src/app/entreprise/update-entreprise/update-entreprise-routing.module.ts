import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdateEntrepriseComponent } from './update-entreprise.component';

const routes: Routes = [{
  path:'',
  component :UpdateEntrepriseComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdateEntrepriseRoutingModule { }
