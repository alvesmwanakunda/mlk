import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PieceComponent } from './piece.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [PieceComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[PieceComponent]
})
export class PieceModule { }
