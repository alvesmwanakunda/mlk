import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MetreComponent } from './metre.component';

const routes: Routes = [{
  path:'',
  component:MetreComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MetreRoutingModule { }
