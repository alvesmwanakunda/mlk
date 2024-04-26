import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailProduitRoutingModule } from './detail-produit-routing.module';
import { DetailProduitComponent } from './detail-produit.component';
import { SharedModule } from '../../shared/shared.module';
import { NavbarModule } from '../../navbar/navbar.module';
import { AuthGuardService } from '../../shared/services/auth-guard.service';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { ProduitsService } from 'src/app/shared/services/produits.service';
import { NgImageSliderModule } from 'ng-image-slider';

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      console.log("Token", token);
      return token || '';
    },
    allowedDomains: [window.location.origin], // Dynamiquement obtenu
    disallowedRoutes: [`${window.location.origin}/produit/:id`], // Dynamiquement obtenu
  };
}


@NgModule({
  declarations: [DetailProduitComponent],
  imports: [
    CommonModule,
    DetailProduitRoutingModule,
    SharedModule,
    NavbarModule,
    NgImageSliderModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
      },
    }),
  ],
  providers:[AuthGuardService, ProduitsService]
})
export class DetailProduitModule { }
