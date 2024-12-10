import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AgendaService } from 'src/app/shared/services/agenda.service';
import { AddPlanningProjetComponent } from './add-planning-projet.component';



@NgModule({
  declarations: [AddPlanningProjetComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers:[AgendaService]
})
export class AddPlanningProjetModule { }
