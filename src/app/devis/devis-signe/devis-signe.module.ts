import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { DevisSigneComponent } from './devis-signe.component';



@NgModule({
  declarations: [DevisSigneComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class DevisSigneModule { }
