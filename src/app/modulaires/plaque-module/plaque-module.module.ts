import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaqueModuleComponent } from './plaque-module.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [PlaqueModuleComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [PlaqueModuleComponent]
})
export class PlaqueModuleModule { }
