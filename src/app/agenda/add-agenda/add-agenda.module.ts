import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AddAgendaComponent } from './add-agenda.component';
import { AgendaService } from 'src/app/shared/services/agenda.service';



@NgModule({
  declarations: [AddAgendaComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers:[AgendaService]
})
export class AddAgendaModule { }
