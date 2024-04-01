import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrcodeModuleRoutingModule } from './qrcode-module-routing.module';
import { QrcodeModuleComponent } from './qrcode-module.component';
import { SharedModule } from '../shared/shared.module';
import { NavbarUserModule } from '../navbar-user/navbar-user.module';



@NgModule({
  declarations: [QrcodeModuleComponent],
  imports: [
    CommonModule,
    QrcodeModuleRoutingModule,
    SharedModule,
    NavbarUserModule
  ]
})
export class QrcodeModuleModule { }
