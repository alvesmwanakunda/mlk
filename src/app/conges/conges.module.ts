import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CongesRoutingModule } from './conges-routing.module';
import { NavbarUserModule } from '../navbar-user/navbar-user.module';
import { AuthGuardService } from '../shared/services/auth-guard.service';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { NavbarModule } from '../navbar/navbar.module';
import { SharedModule } from '../shared/shared.module';
import { CongesComponent } from './conges.component';

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      console.log("Token", token);
      return token || '';
    },
    allowedDomains: [window.location.origin], // Dynamiquement obtenu
    disallowedRoutes: [`${window.location.origin}/conges`], // Dynamiquement obtenu
  };
}


@NgModule({
  declarations: [CongesComponent],
  imports: [
    CommonModule,
    CongesRoutingModule,
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
export class CongesModule { }
