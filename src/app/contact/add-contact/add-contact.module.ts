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

import { AuthGuardService } from '../../shared/services/auth-guard.service';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      console.log("Token", token);
      return token || '';
    },
    allowedDomains: [window.location.origin], // Dynamiquement obtenu
    disallowedRoutes: [`${window.location.origin}/add/contact`], // Dynamiquement obtenu
  };
}


@NgModule({
  declarations: [AddContactComponent],
  imports: [
    CommonModule,
    AddContactRoutingModule,
    SharedModule,
    NavbarModule,
    ReactiveFormsModule,
    FormsModule,
    NavbarUserModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
      },
    }),
  ],
  providers:[CountriesService,ProjetsService,EntreprisesService,ContactsService,AuthGuardService]
})
export class AddContactModule { }
