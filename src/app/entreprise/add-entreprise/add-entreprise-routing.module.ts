import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEntrepriseComponent } from './add-entreprise.component';

const routes: Routes = [{
  path:'',
  component: AddEntrepriseComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddEntrepriseRoutingModule { }
