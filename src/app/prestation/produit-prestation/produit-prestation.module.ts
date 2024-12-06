import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProduitPrestationRoutingModule } from './produit-prestation-routing.module';
import { ProduitPrestationComponent } from './produit-prestation.component';
import { NavbarUserModule } from '../../navbar-user/navbar-user.module';
import { AuthGuardService } from '../../shared/services/auth-guard.service';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { NavbarModule } from '../../navbar/navbar.module';
import { SharedModule } from '../../shared/shared.module';
import { AddProduitPrestaModule } from './add-produit-presta/add-produit-presta.module';
import { UpdateProduitPrestaModule } from './update-produit-presta/update-produit-presta.module';
import { DeleteProduitPrestaModule } from './delete-produit-presta/delete-produit-presta.module';
export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      console.log("Token", token);
      return token || '';
    },
    allowedDomains: [window.location.origin], // Dynamiquement obtenu
    disallowedRoutes: [`${window.location.origin}/prestations/produit/:id`], // Dynamiquement obtenu
  };
}


@NgModule({
  declarations: [ProduitPrestationComponent],
  imports: [
    CommonModule,
    ProduitPrestationRoutingModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
      },
    }),
    NavbarUserModule,
    NavbarModule,
    SharedModule,
    AddProduitPrestaModule,
    UpdateProduitPrestaModule,
    DeleteProduitPrestaModule
  ],
  providers: [AuthGuardService],
})
export class ProduitPrestationModule { }
