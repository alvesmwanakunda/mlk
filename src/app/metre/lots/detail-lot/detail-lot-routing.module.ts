import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailLotComponent } from './detail-lot.component';

const routes: Routes = [{
  path:'',
  component:DetailLotComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailLotRoutingModule { }
