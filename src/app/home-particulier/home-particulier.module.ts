import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeParticulierRoutingModule } from './home-particulier-routing.module';
import { HomeParticulierComponent } from './home-particulier.component';
import { NavbarUserModule } from '../navbar-user/navbar-user.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    HomeParticulierComponent
  ],
  imports: [
    CommonModule,
    HomeParticulierRoutingModule,
    NavbarUserModule,
    SharedModule
  ]
})
export class HomeParticulierModule { }
