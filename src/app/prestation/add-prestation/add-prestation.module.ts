import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddPrestationComponent } from './add-prestation.component';



@NgModule({
  declarations: [AddPrestationComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [AddPrestationComponent]
})
export class AddPrestationModule { }
