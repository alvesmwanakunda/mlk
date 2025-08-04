import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { UpdateTachesComponent } from './update-taches.component';
import { DeleteTachesModule } from '../delete-taches/delete-taches.module';




@NgModule({
  declarations: [UpdateTachesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DeleteTachesModule
  ]
})
export class UpdateTachesModule { }
