import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlansComponent } from './plans.component';
import { SharedModule } from 'src/app/shared/shared.module';




@NgModule({
  declarations: [
    PlansComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[PlansComponent]
})
export class PlansModule { }
