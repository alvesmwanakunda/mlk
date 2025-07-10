import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParametresRoutingModule } from './parametres-routing.module';
import { ParametresComponent } from './parametres.component';
import { SharedModule } from '../shared/shared.module';
import { NavbarModule } from '../navbar/navbar.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { AuthGuardService } from '../shared/services/auth-guard.service';
import { AuthService } from '../shared/services/auth.service';
import { FormsModule } from '@angular/forms';

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      console.log("Token", token);
      return token || '';
    },
    allowedDomains: [window.location.origin], // Dynamiquement obtenu
    disallowedRoutes: [`${window.location.origin}/parametres`], // Dynamiquement obtenu
  };
}

@NgModule({
  declarations: [
    ParametresComponent
  ],
  imports: [
    CommonModule,
    ParametresRoutingModule,
    SharedModule,
    FormsModule,
    NavbarModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatSnackBarModule,
    MatProgressBarModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
      },
    }),
  ],
  providers:[AuthService,AuthGuardService]
})
export class ParametresModule { }
