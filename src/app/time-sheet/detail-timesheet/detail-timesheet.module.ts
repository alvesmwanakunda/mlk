import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailTimesheetRoutingModule } from './detail-timesheet-routing.module';
import { DetailTimesheetComponent } from './detail-timesheet.component';
import { NavbarUserModule } from '../../navbar-user/navbar-user.module';
import { AuthGuardService } from '../../shared/services/auth-guard.service';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { NavbarModule } from '../../navbar/navbar.module';
import { SharedModule } from '../../shared/shared.module';
import { TimesheetService } from 'src/app/shared/services/timesheet.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      console.log("Token", token);
      return token || '';
    },
    allowedDomains: [window.location.origin], // Dynamiquement obtenu
    disallowedRoutes: [`${window.location.origin}/timesheet/:id`], // Dynamiquement obtenu
  };
}

@NgModule({
  declarations: [DetailTimesheetComponent],
  imports: [
    CommonModule,
    DetailTimesheetRoutingModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
      },
    }),
    NavbarUserModule,
    NavbarModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [AuthGuardService,TimesheetService],
})
export class DetailTimesheetModule { }
