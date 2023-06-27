import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { AgendaService } from 'src/app/shared/services/agenda.service';
import { DeleteAgendaComponent } from './delete-agenda.component';



@NgModule({
  declarations: [DeleteAgendaComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers:[AgendaService]
})
export class DeleteAgendaModule { }
