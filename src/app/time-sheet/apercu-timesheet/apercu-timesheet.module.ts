import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApercuTimesheetRoutingModule } from './apercu-timesheet-routing.module';
import { ApercuTimesheetComponent } from './apercu-timesheet.component';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { NavbarUserModule } from 'src/app/navbar-user/navbar-user.module';
import { NavbarModule } from 'src/app/navbar/navbar.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service';
import { TimesheetService } from 'src/app/shared/services/timesheet.service';

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      console.log("Token", token);
      return token || '';
    },
    allowedDomains: [window.location.origin], // Dynamiquement obtenu
    disallowedRoutes: [`${window.location.origin}/timesheet/:id/apercu/:month/:year`], // Dynamiquement obtenu
  };
}

@NgModule({
  declarations: [ ApercuTimesheetComponent ],
  imports: [
    CommonModule,
    ApercuTimesheetRoutingModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
      },
    }),
    NavbarUserModule,
    NavbarModule,
    SharedModule
  ],
  providers: [AuthGuardService,TimesheetService]
})
export class ApercuTimesheetModule { }
