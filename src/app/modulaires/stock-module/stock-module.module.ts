import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockModuleComponent } from './stock-module.component';
import { SharedModule } from '../../shared/shared.module';
import { DeleteModuleModule } from '../delete-module/delete-module.module';


@NgModule({
  declarations: [StockModuleComponent],
  imports: [
    CommonModule,
    SharedModule,
    DeleteModuleModule

  ],
  exports: [StockModuleComponent]
})
export class StockModuleModule { }
