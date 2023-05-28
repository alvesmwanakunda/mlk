import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppartementComponent } from './appartement.component';

const routes: Routes = [{
  path:'',
  component:AppartementComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppartementRoutingModule { }
