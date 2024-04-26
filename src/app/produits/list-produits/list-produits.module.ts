import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListProduitsComponent } from './list-produits.component';
import { ListProduitsRoutingModule } from './list-produits-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NavbarModule } from '../../navbar/navbar.module';
import { AuthGuardService } from '../../shared/services/auth-guard.service';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { ProduitsService } from 'src/app/shared/services/produits.service';

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      console.log("Token", token);
      return token || '';
    },
    allowedDomains: [window.location.origin], // Dynamiquement obtenu
    disallowedRoutes: [`${window.location.origin}/produits`], // Dynamiquement obtenu
  };
}


@NgModule({
  declarations: [ListProduitsComponent],
  imports: [
    CommonModule,
    ListProduitsRoutingModule,
    SharedModule,
    NavbarModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
      },
    }),
  ],
  providers:[AuthGuardService, ProduitsService]

})
export class ListProduitsModule { }
