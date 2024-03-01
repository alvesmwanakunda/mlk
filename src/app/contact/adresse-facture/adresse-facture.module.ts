import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdresseFactureComponent } from './adresse-facture.component';
import { ContactsService } from 'src/app/shared/services/contacts.service';


@NgModule({
  declarations: [AdresseFactureComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [AdresseFactureComponent],
  providers:[ContactsService]
})
export class AdresseFactureModule { }
