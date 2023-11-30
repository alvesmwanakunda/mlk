import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { NavbarUserModule } from '../navbar-user/navbar-user.module';
import { JwtHelperService } from '@auth0/angular-jwt';



@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NavbarUserModule
  ],
  providers:[AuthService,JwtHelperService]
})
export class LoginModule { }
