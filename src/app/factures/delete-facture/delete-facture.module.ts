import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteFactureComponent } from './delete-facture.component';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [DeleteFactureComponent],
  imports: [
    CommonModule,
    SharedModule,
  ]
})
export class DeleteFactureModule { }
