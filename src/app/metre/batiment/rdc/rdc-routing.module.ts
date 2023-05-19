import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RdcComponent } from './rdc.component';

const routes: Routes = [{
  path: '',
  component: RdcComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RdcRoutingModule { }
