import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { DeletePrestationComponent } from './delete-prestation.component';



@NgModule({
  declarations: [DeletePrestationComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [DeletePrestationComponent]
})
export class DeletePrestationModule { }
