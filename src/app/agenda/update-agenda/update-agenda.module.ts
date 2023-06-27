import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AgendaService } from 'src/app/shared/services/agenda.service';
import { UpdateAgendaComponent } from './update-agenda.component';



@NgModule({
  declarations: [UpdateAgendaComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers:[AgendaService]
})
export class UpdateAgendaModule { }
