import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddContactRoutingModule } from './add-contact-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NavbarModule } from 'src/app/navbar/navbar.module';
import { AddContactComponent } from './add-contact.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CountriesService } from 'src/app/shared/services/countries.service';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { EntreprisesService } from 'src/app/shared/services/entreprises.service';
import { ContactsService } from 'src/app/shared/services/contacts.service';
import { NavbarUserModule } from 'src/app/navbar-user/navbar-user.module';


@NgModule({
  declarations: [AddContactComponent],
  imports: [
    CommonModule,
    AddContactRoutingModule,
    SharedModule,
    NavbarModule,
    ReactiveFormsModule,
    FormsModule,
    NavbarUserModule
  ],
  providers:[CountriesService,ProjetsService,EntreprisesService,ContactsService]
})
export class AddContactModule { }
