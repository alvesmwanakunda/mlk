import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddLotComponent } from './add-lot.component';



@NgModule({
  declarations: [AddLotComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[AddLotComponent]
})
export class AddLotModule { }
