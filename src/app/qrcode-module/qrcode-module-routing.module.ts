import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QrcodeModuleComponent } from './qrcode-module.component';

const routes: Routes = [{
  path:"",
  component:QrcodeModuleComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QrcodeModuleRoutingModule { }
