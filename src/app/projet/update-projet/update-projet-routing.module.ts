import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdateProjetComponent } from './update-projet.component';

const routes: Routes = [{
  path:'',
  component :UpdateProjetComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdateProjetRoutingModule { }
