import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ContactsService } from 'src/app/shared/services/contacts.service';
import { AdresseLivraisonComponent } from './adresse-livraison.component';



@NgModule({
  declarations: [AdresseLivraisonComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [AdresseLivraisonComponent],
  providers:[ContactsService]
})
export class AdresseLivraisonModule { }
