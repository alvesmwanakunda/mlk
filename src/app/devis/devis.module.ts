import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevisRoutingModule } from './devis-routing.module';
import { DevisComponent } from './devis.component';
import { SharedModule } from '../shared/shared.module';
import { NavbarModule } from '../navbar/navbar.module';
import { AddDevisModule } from './add-devis/add-devis.module';
import { ViewerStandarModule } from '../viewer-standar/viewer-standar.module';
import { UpdateDevisModule } from './update-devis/update-devis.module';
import { DeleteDevisModule} from './delete-devis/delete-devis.module';
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
    disallowedRoutes: [`${window.location.origin}/devis`], // Dynamiquement obtenu
  };
}


@NgModule({
  declarations: [DevisComponent],
  imports: [
    CommonModule,
    DevisRoutingModule,
    SharedModule,
    NavbarModule,
    AddDevisModule,
    ViewerStandarModule,
    UpdateDevisModule,
    DeleteDevisModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
      },
    }),
  ],
  providers:[AuthGuardService]
})
export class DevisModule { }
