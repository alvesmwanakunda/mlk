import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddDevisComponent } from './add-devis.component';
import { AddDevisRoutingModule } from './add-devis-routing.module';
import { AuthGuardService } from '../../shared/services/auth-guard.service';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { NavbarModule } from 'src/app/navbar/navbar.module';

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      console.log("Token", token);
      return token || '';
    },
    allowedDomains: [window.location.origin], // Dynamiquement obtenu
    disallowedRoutes: [`${window.location.origin}/new/devis`], // Dynamiquement obtenu
  };
}


@NgModule({
  declarations: [AddDevisComponent],
  imports: [
    CommonModule,
    AddDevisRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NavbarModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
      },
    }),
  ],
  providers:[AuthGuardService]
})
export class AddDevisModule { }
