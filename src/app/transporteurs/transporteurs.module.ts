import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransporteursRoutingModule } from './transporteurs-routing.module';
import { TransporteursComponent } from './transporteurs.component';
import { NavbarUserModule } from '../navbar-user/navbar-user.module';
import { AuthGuardService } from '../shared/services/auth-guard.service';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { NavbarModule } from '../navbar/navbar.module';
import { SharedModule } from '../shared/shared.module';
export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      console.log("Token", token);
      return token || '';
    },
    allowedDomains: [window.location.origin], // Dynamiquement obtenu
    disallowedRoutes: [`${window.location.origin}/transporteurs`], // Dynamiquement obtenu
  };
}


@NgModule({
  declarations: [TransporteursComponent],
  imports: [
    CommonModule,
    TransporteursRoutingModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
      },
    }),
    NavbarUserModule,
    NavbarModule,
    SharedModule,
  ],
  providers: [AuthGuardService],
})
export class TransporteursModule { }
