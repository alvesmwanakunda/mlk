import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PositionMapComponent } from './position-map.component';

@NgModule({
  declarations: [PositionMapComponent],
  imports: [
    CommonModule
  ],
  exports: [PositionMapComponent]
})
export class PositionMapModule { }
