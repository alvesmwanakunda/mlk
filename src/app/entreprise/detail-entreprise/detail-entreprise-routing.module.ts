import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailEntrepriseComponent } from './detail-entreprise.component';

const routes: Routes = [{
  path:'',
  component:DetailEntrepriseComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailEntrepriseRoutingModule { }
