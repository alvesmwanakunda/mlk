import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdateModuleComponent } from './update-module.component';

const routes: Routes = [{
  path:"",
  component:UpdateModuleComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdateModuleRoutingModule { }
