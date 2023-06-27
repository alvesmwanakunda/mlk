import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdateContactComponent } from './update-contact.component';

const routes: Routes = [{
  path:'',
  component:UpdateContactComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdateContactRoutingModule { }
