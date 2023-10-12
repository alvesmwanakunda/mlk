import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailUserProjetComponent } from './detail-user-projet.component';

const routes: Routes = [{
  path:'',
  component:DetailUserProjetComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailUserProjetRoutingModule { }
