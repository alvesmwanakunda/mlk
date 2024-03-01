import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateContactRoutingModule } from './update-contact-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NavbarModule } from 'src/app/navbar/navbar.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CountriesService } from 'src/app/shared/services/countries.service';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { EntreprisesService } from 'src/app/shared/services/entreprises.service';
import { ContactsService } from 'src/app/shared/services/contacts.service';
import { UpdateContactComponent } from './update-contact.component';
import { NavbarUserModule } from 'src/app/navbar-user/navbar-user.module';
import { AdresseFactureModule } from '../adresse-facture/adresse-facture.module';
import { AdresseLivraisonModule } from '../adresse-livraison/adresse-livraison.module';


@NgModule({
  declarations: [UpdateContactComponent],
  imports: [
    CommonModule,
    UpdateContactRoutingModule,
    SharedModule,
    NavbarModule,
    ReactiveFormsModule,
    FormsModule,
    NavbarUserModule,
    AdresseFactureModule,
    AdresseLivraisonModule
  ],
  providers:[CountriesService,ProjetsService,EntreprisesService,ContactsService]
})
export class UpdateContactModule { }
