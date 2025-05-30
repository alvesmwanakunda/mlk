import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSheetRoutingModule } from './time-sheet-routing.module';
import { TimeSheetComponent } from './time-sheet.component';
import { NavbarUserModule } from '../navbar-user/navbar-user.module';
import { AuthGuardService } from '../shared/services/auth-guard.service';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { NavbarModule } from '../navbar/navbar.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApercuTimesheetComponent } from './apercu-timesheet/apercu-timesheet.component';

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      console.log("Token", token);
      return token || '';
    },
    allowedDomains: [window.location.origin], // Dynamiquement obtenu
    disallowedRoutes: [`${window.location.origin}/timesheet`], // Dynamiquement obtenu
  };
}


@NgModule({
  declarations: [TimeSheetComponent],
  imports: [
    CommonModule,
    TimeSheetRoutingModule,
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
    ReactiveFormsModule
  ],
  providers: [AuthGuardService],
})
export class TimeSheetModule { }
