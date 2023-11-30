import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilComponent } from './profil.component';
import { ProfilRoutingModule } from './profil-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NavbarModule } from '../navbar/navbar.module';
import { NavbarUserModule } from '../navbar-user/navbar-user.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { AuthGuardService } from '../shared/services/auth-guard.service';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      console.log("Token", token);
      return token || '';
    },
    allowedDomains: [window.location.origin], // Dynamiquement obtenu
    disallowedRoutes: [`${window.location.origin}/profil`], // Dynamiquement obtenu
  };
}


@NgModule({
  declarations: [ProfilComponent],
  imports: [
    CommonModule,
    ProfilRoutingModule,
    SharedModule,
    NavbarModule,
    NavbarUserModule,
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
export class ProfilModule { }
