import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdatePrestationComponent } from './update-prestation.component';



@NgModule({
  declarations: [UpdatePrestationComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[UpdatePrestationComponent]
})
export class UpdatePrestationModule { }
