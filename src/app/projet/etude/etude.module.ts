import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EtudeComponent } from './etude.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [EtudeComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[EtudeComponent]
})
export class EtudeModule { }
