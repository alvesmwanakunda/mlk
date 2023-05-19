import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoxRoutingModule } from './box-routing.module';
import { BoxComponent } from './box.component';
import { SharedModule } from '../shared/shared.module';
import { NavbarModule } from '../navbar/navbar.module';


@NgModule({
  declarations: [BoxComponent],
  imports: [
    CommonModule,
    BoxRoutingModule,
    SharedModule,
    NavbarModule
  ]
})
export class BoxModule { }
