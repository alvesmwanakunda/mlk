import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjetUserComponent } from './projet-user.component';

const routes: Routes = [{
  path:'',
  component:ProjetUserComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjetUserRoutingModule { }
