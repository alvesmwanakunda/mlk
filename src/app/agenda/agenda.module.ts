import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgendaRoutingModule } from './agenda-routing.module';
import { AgendaComponent } from './agenda.component';
import { NavbarModule } from '../navbar/navbar.module';
import { SharedModule } from '../shared/shared.module';
import { CalendarModule, DateAdapter, CalendarNativeDateFormatter, DateFormatterParams, CalendarDateFormatter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AddAgendaModule } from './add-agenda/add-agenda.module';
import { AgendaService } from '../shared/services/agenda.service';
import { UpdateAgendaModule } from './update-agenda/update-agenda.module';
import { DeleteAgendaModule } from './delete-agenda/delete-agenda.module';
import { DetailAgendaModule } from './detail-agenda/detail-agenda.module';
import { NavbarUserModule } from '../navbar-user/navbar-user.module';
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
    disallowedRoutes: [`${window.location.origin}/agenda`], // Dynamiquement obtenu
  };
}

class CustomDateFormatter extends CalendarNativeDateFormatter{
  public override dayViewHour({ date, locale }: DateFormatterParams): string {
      return new Intl.DateTimeFormat(locale,{hour:'numeric',minute:'numeric'}).format(date);
  }
}


@NgModule({
  declarations: [AgendaComponent],
  imports: [
    CommonModule,
    AgendaRoutingModule,
    NavbarModule,
    SharedModule,
    AddAgendaModule,
    UpdateAgendaModule,
    DeleteAgendaModule,
    DetailAgendaModule,
    NavbarUserModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    },{
      dateFormatter: {
        provide: CalendarDateFormatter,
        useClass:CustomDateFormatter
      },
    }),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
      },
    }),
  ],
  providers:[AgendaService,AuthGuardService]
})
export class AgendaModule { }
