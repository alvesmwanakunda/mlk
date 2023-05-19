import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LotsComponent } from './lots.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [LotsComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[LotsComponent]

})
export class LotsModule { }
