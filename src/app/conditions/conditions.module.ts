import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConditionsComponent } from './conditions.component';
import { ConditionsRoutingModule } from './conditions-routing.module';
import { NavbarUserModule } from '../navbar-user/navbar-user.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [ConditionsComponent],
  imports: [
    CommonModule,
    ConditionsRoutingModule,
    NavbarUserModule,
    SharedModule
  ]
})
export class ConditionsModule { }
