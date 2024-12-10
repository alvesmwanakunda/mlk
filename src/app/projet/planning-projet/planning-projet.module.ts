import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanningProjetComponent } from './planning-projet.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarModule, DateAdapter, CalendarNativeDateFormatter, DateFormatterParams, CalendarDateFormatter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AgendaService } from '../../shared/services/agenda.service';
import { AddPlanningProjetModule } from './add-planning-projet/add-planning-projet.module';
import { DeleteAgendaModule } from 'src/app/agenda/delete-agenda/delete-agenda.module';
import { DetailAgendaModule } from 'src/app/agenda/detail-agenda/detail-agenda.module';
import { UpdateAgendaModule } from 'src/app/agenda/update-agenda/update-agenda.module';

class CustomDateFormatter extends CalendarNativeDateFormatter{
  public override dayViewHour({ date, locale }: DateFormatterParams): string {
      return new Intl.DateTimeFormat(locale,{hour:'numeric',minute:'numeric'}).format(date);
  }
}

@NgModule({
  declarations: [PlanningProjetComponent],
  imports: [
    CommonModule,
    SharedModule,
    AddPlanningProjetModule,
    DeleteAgendaModule,
    DetailAgendaModule,
    UpdateAgendaModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    },{
      dateFormatter: {
        provide: CalendarDateFormatter,
        useClass:CustomDateFormatter
      },
    }),
  ],
  providers:[AgendaService],
  exports:[PlanningProjetComponent]
})
export class PlanningProjetModule { }
