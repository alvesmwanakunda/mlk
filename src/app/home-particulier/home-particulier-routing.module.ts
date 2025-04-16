import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeParticulierComponent } from './home-particulier.component';

const routes: Routes = [{
  path: '',
  component: HomeParticulierComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeParticulierRoutingModule { }
