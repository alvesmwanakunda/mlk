import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgendaRoutingModule } from './agenda-routing.module';
import { AgendaComponent } from './agenda.component';
import { NavbarModule } from '../navbar/navbar.module';
import { SharedModule } from '../shared/shared.module';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AddAgendaModule } from './add-agenda/add-agenda.module';
import { AgendaService } from '../shared/services/agenda.service';
import { UpdateAgendaModule } from './update-agenda/update-agenda.module';
import { DeleteAgendaModule } from './delete-agenda/delete-agenda.module';
import { DetailAgendaModule } from './detail-agenda/detail-agenda.module';
import { NavbarUserModule } from '../navbar-user/navbar-user.module';


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
    })
  ],
  providers:[AgendaService]
})
export class AgendaModule { }
