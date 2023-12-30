import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevisPdfRoutingModule } from './devis-pdf-routing.module';
import { DevisPdfComponent } from './devis-pdf.component';
import { SharedModule } from 'src/app/shared/shared.module';
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
    disallowedRoutes: [`${window.location.origin}/devis/:id/:type`], // Dynamiquement obtenu
  };
}


@NgModule({
  declarations: [DevisPdfComponent],
  imports: [
    CommonModule,
    DevisPdfRoutingModule,
    SharedModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
      },
    }),
  ],
  providers:[AuthGuardService]
})
export class DevisPdfModule { }
