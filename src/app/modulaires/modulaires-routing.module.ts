import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModulairesComponent } from './modulaires.component';

const routes: Routes = [{
  path:'',
  component:ModulairesComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulairesRoutingModule { }
