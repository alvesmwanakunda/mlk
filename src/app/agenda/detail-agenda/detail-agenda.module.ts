import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { AgendaService } from 'src/app/shared/services/agenda.service';
import { DetailAgendaComponent } from './detail-agenda.component';
import { UpdateAgendaModule } from '../update-agenda/update-agenda.module';
import { DeleteAgendaModule } from '../delete-agenda/delete-agenda.module';



@NgModule({
  declarations: [DetailAgendaComponent],
  imports: [
    CommonModule,
    SharedModule,
    UpdateAgendaModule,
    DeleteAgendaModule
  ],
  providers:[AgendaService]
})
export class DetailAgendaModule { }
