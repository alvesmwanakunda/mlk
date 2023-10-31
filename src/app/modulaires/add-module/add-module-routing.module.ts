import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddModuleComponent } from './add-module.component';

const routes: Routes = [{
  path:'',
  component:AddModuleComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddModuleRoutingModule { }
