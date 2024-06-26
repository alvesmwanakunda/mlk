import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentTimesheetRoutingModule } from './agent-timesheet-routing.module';
import { AgentTimesheetComponent } from './agent-timesheet.component';
import { NavbarUserModule } from '../../navbar-user/navbar-user.module';
import { AuthGuardService } from '../../shared/services/auth-guard.service';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { NavbarModule } from '../../navbar/navbar.module';
import { SharedModule } from '../../shared/shared.module';
import { TimesheetService } from 'src/app/shared/services/timesheet.service';

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      console.log("Token", token);
      return token || '';
    },
    allowedDomains: [window.location.origin], // Dynamiquement obtenu
    disallowedRoutes: [`${window.location.origin}/agent/timesheet`], // Dynamiquement obtenu
  };
}


@NgModule({
  declarations: [AgentTimesheetComponent],
  imports: [
    CommonModule,
    AgentTimesheetRoutingModule,
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
  providers: [AuthGuardService,TimesheetService],
})
export class AgentTimesheetModule { }
