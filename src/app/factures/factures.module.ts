import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacturesRoutingModule } from './factures-routing.module';
import { FacturesComponent } from './factures.component';
import { SharedModule } from '../shared/shared.module';
import { NavbarModule } from '../navbar/navbar.module';
import { ViewerStandarModule } from '../viewer-standar/viewer-standar.module';
import { AddFactureModule } from './add-facture/add-facture.module';
import { UpdateFactureModule } from './update-facture/update-facture.module';
import { DeleteFactureModule } from './delete-facture/delete-facture.module';
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
    disallowedRoutes: [`${window.location.origin}/facture`], // Dynamiquement obtenu
  };
}



@NgModule({
  declarations: [FacturesComponent],
  imports: [
    CommonModule,
    FacturesRoutingModule,
    SharedModule,
    NavbarModule,
    ViewerStandarModule,
    AddFactureModule,
    UpdateFactureModule,
    DeleteFactureModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
      },
    }),
  ],
  providers:[AuthGuardService]
})
export class FacturesModule { }
