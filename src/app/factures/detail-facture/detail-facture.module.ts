import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailFactureRoutingModule } from './detail-facture-routing.module';
import { DetailFactureComponent } from './detail-facture.component';
import { SharedModule } from 'src/app/shared/shared.module';
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
    disallowedRoutes: [`${window.location.origin}/facture/:id`], // Dynamiquement obtenu
  };
}



@NgModule({
  declarations: [DetailFactureComponent],
  imports: [
    CommonModule,
    DetailFactureRoutingModule,
    SharedModule,
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
export class DetailFactureModule { }
