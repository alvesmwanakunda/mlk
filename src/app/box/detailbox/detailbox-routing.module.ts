import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailboxComponent } from './detailbox.component';

const routes: Routes = [{
  path:'',
  component :DetailboxComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailboxRoutingModule { }
