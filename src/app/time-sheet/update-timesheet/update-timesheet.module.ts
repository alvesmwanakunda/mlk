import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateTimesheetRoutingModule } from './update-timesheet-routing.module';
import { UpdateTimesheetComponent } from './update-timesheet.component';
import { NavbarUserModule } from '../../navbar-user/navbar-user.module';
import { AuthGuardService } from '../../shared/services/auth-guard.service';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { NavbarModule } from '../../navbar/navbar.module';
import { SharedModule } from '../../shared/shared.module';
import { TimesheetService } from 'src/app/shared/services/timesheet.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeleteTimesheetModule } from '../delete-timesheet/delete-timesheet.module';
import { DialogUpdateTimesheetModule } from '../dialog-update-timesheet/dialog-update-timesheet.module';
import { MonthService } from 'src/app/shared/services/month.service';

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      console.log("Token", token);
      return token || '';
    },
    allowedDomains: [window.location.origin], // Dynamiquement obtenu
    disallowedRoutes: [`${window.location.origin}/timesheet/:id/:month/:year`], // Dynamiquement obtenu
  };
}


@NgModule({
  declarations: [UpdateTimesheetComponent],
  imports: [
    CommonModule,
    UpdateTimesheetRoutingModule,
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
    DeleteTimesheetModule,
    DialogUpdateTimesheetModule
  ],
  providers: [AuthGuardService,TimesheetService, MonthService],
  
})
export class UpdateTimesheetModule { }
