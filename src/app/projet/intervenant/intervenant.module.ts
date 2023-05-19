import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntervenantComponent } from './intervenant.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [IntervenantComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[IntervenantComponent]
})
export class IntervenantModule { }
