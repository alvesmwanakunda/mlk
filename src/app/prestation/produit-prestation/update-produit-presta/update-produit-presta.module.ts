import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateProduitPrestaComponent } from './update-produit-presta.component';



@NgModule({
  declarations: [UpdateProduitPrestaComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [UpdateProduitPrestaComponent]
})
export class UpdateProduitPrestaModule { }
