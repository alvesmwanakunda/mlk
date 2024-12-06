import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockProjetComponent } from './stock-projet.component';
import { SharedModule } from '../shared/shared.module';




@NgModule({
  declarations: [StockProjetComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[StockProjetComponent]
})
export class StockProjetModule { }
