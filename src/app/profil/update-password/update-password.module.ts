import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdatePasswordRoutingModule } from './update-password-routing.module';
import { UpdatePasswordComponent } from './update-password.component';
import { SharedModule } from '../../shared/shared.module';
import { NavbarModule } from '../../navbar/navbar.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { AuthGuardService } from '../../shared/services/auth-guard.service';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      console.log("Token", token);
      return token || '';
    },
    allowedDomains: [window.location.origin], // Dynamiquement obtenu
    disallowedRoutes: [`${window.location.origin}/profil/password`], // Dynamiquement obtenu
  };
}

@NgModule({
  declarations: [UpdatePasswordComponent],
  imports: [
    CommonModule,
    UpdatePasswordRoutingModule,
    SharedModule,
    NavbarModule,
    FormsModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
      },
    }),
  ],
  providers:[AuthService,AuthGuardService]
})
export class UpdatePasswordModule { }
