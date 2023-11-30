import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardUserComponent } from './dashboard-user.component';
import { DashboardUserRoutingModule } from './dashboard-user-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ProjetsService } from '../shared/services/projets.service';
import { NavbarModule } from '../navbar/navbar.module';
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
    disallowedRoutes: [`${window.location.origin}/entreprise/dashboard`], // Dynamiquement obtenu
  };
}


@NgModule({
  declarations: [DashboardUserComponent],
  imports: [
    CommonModule,
    DashboardUserRoutingModule,
    SharedModule,
    NavbarModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
      },
    }),
  ],
  providers:[ProjetsService,AuthGuardService]
})
export class DashboardUserModule { }
