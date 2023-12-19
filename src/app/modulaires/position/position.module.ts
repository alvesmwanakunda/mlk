import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { PositionComponent } from './position.component';



@NgModule({
  declarations: [PositionComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class PositionModule { }
