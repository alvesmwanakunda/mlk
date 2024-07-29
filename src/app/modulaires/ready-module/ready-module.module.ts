import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReadyModuleComponent } from './ready-module.component';
import { SharedModule } from '../../shared/shared.module';
import { DeleteModuleModule } from '../delete-module/delete-module.module';



@NgModule({
  declarations: [ReadyModuleComponent],
  imports: [
    CommonModule,
    SharedModule,
    DeleteModuleModule
  ],
  exports: [ReadyModuleComponent]
})
export class ReadyModuleModule { }
