import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup.component';
import { SignupRoutingModule } from './signup-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { NavbarUserModule } from '../navbar-user/navbar-user.module';



@NgModule({
  declarations: [SignupComponent],
  imports: [
    CommonModule,
    SignupRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NavbarUserModule
  ],
  providers:[AuthService]
})
export class SignupModule { }
