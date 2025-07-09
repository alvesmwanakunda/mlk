import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerificationRoutingModule } from './verification-routing.module';
import { VerificationComponent } from './verification.component';
import { AuthService } from '../shared/services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SharedModule } from '../shared/shared.module';
import { NavbarUserModule } from '../navbar-user/navbar-user.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    VerificationComponent
  ],
  imports: [
    CommonModule,
    VerificationRoutingModule,
    SharedModule,
    NavbarUserModule,
    MatSnackBarModule,
    ReactiveFormsModule
  ],
  providers:[AuthService,JwtHelperService]
})
export class VerificationModule { }
