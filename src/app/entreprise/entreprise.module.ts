import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntrepriseRoutingModule } from './entreprise-routing.module';
import { EntrepriseComponent } from './entreprise.component';
import { SharedModule } from '../shared/shared.module';
import { NavbarModule } from '../navbar/navbar.module';
import { EntreprisesService } from '../shared/services/entreprises.service';
import { TabEntrepriseModule } from './tab-entreprise/tab-entreprise.module';
import { AuthGuardService } from '../shared/services/auth-guard.service';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      console.log("Token", token);
      return token || '';
    },
    allowedDomains: [window.location.origin], // Dynamiquement obtenu
    disallowedRoutes: [`${window.location.origin}/entreprises`], // Dynamiquement obtenu
  };
}



@NgModule({
  declarations: [EntrepriseComponent],
  imports: [
    CommonModule,
    EntrepriseRoutingModule,
    SharedModule,
    NavbarModule,
    TabEntrepriseModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
      },
    }),
  ],
  providers:[EntreprisesService,AuthGuardService]
})
export class EntrepriseModule { }
