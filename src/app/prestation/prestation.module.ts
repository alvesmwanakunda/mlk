import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrestationRoutingModule } from './prestation-routing.module';
import { PrestationComponent } from './prestation.component';
import { NavbarUserModule } from '../navbar-user/navbar-user.module';
import { AuthGuardService } from '../shared/services/auth-guard.service';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { NavbarModule } from '../navbar/navbar.module';
import { SharedModule } from '../shared/shared.module';
import { AddPrestationModule } from './add-prestation/add-prestation.module';
import { UpdatePrestationModule } from './update-prestation/update-prestation.module';
import { DeletePrestationModule } from './delete-prestation/delete-prestation.module';
export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      console.log("Token", token);
      return token || '';
    },
    allowedDomains: [window.location.origin], // Dynamiquement obtenu
    disallowedRoutes: [`${window.location.origin}/prestations`], // Dynamiquement obtenu
  };
}

@NgModule({
  declarations: [PrestationComponent],
  imports: [
    CommonModule,
    PrestationRoutingModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
      },
    }),
    NavbarUserModule,
    NavbarModule,
    SharedModule,
    AddPrestationModule,
    UpdatePrestationModule,
    DeletePrestationModule
  ],
  providers: [AuthGuardService],
})
export class PrestationModule { }
