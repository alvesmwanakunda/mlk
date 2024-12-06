import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddProduitPrestaComponent } from './add-produit-presta.component';



@NgModule({
  declarations: [AddProduitPrestaComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [AddProduitPrestaComponent]
})
export class AddProduitPrestaModule { }
