import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DeleteContactComponent } from './delete-contact.component';
import { ContactsService } from 'src/app/shared/services/contacts.service';



@NgModule({
  declarations: [DeleteContactComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers:[ContactsService]
})
export class DeleteContactModule { }
