import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RdcRoutingModule } from './rdc-routing.module';
import { RdcComponent } from './rdc.component';
import { NavbarModule } from 'src/app/navbar/navbar.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [RdcComponent],
  imports: [
    CommonModule,
    RdcRoutingModule,
    NavbarModule,
    SharedModule
  ]
})
export class RdcModule { }
