import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactRoutingModule } from './contact-routing.module';
import { ContactComponent } from './contact.component';
import { SharedModule } from '../shared/shared.module';
import { NavbarModule } from '../navbar/navbar.module';
import { ContactsService } from '../shared/services/contacts.service';
import { DeleteContactModule } from './delete-contact/delete-contact.module';


@NgModule({
  declarations: [ContactComponent],
  imports: [
    CommonModule,
    ContactRoutingModule,
    SharedModule,
    NavbarModule,
    DeleteContactModule
  ],
  providers:[ContactsService]
})
export class ContactModule { }
