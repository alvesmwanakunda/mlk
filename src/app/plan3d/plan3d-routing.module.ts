import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Plan3dComponent } from './plan3d.component';

const routes: Routes = [{
  path:'',
  component:Plan3dComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Plan3dRoutingModule { }
