import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DeleteProduitPrestaComponent } from './delete-produit-presta.component';



@NgModule({
  declarations: [DeleteProduitPrestaComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[DeleteProduitPrestaComponent]
})
export class DeleteProduitPrestaModule { }
