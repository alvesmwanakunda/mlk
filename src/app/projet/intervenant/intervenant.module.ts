import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntervenantComponent } from './intervenant.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ContactsService } from 'src/app/shared/services/contacts.service';



@NgModule({
  declarations: [IntervenantComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[IntervenantComponent],
  providers:[ContactsService]
})
export class IntervenantModule { }
