import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrepareModuleComponent } from './prepare-module.component';
import { SharedModule } from '../../shared/shared.module';
import { DeleteModuleModule } from '../delete-module/delete-module.module';



@NgModule({
  declarations: [PrepareModuleComponent],
  imports: [
    CommonModule,
    SharedModule,
    DeleteModuleModule
  ],
  exports: [PrepareModuleComponent]
})
export class PrepareModuleModule { }
