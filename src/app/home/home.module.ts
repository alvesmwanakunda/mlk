import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { NavbarUserModule } from '../navbar-user/navbar-user.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    NavbarUserModule,
    SharedModule
  ]
})
export class HomeModule { }
