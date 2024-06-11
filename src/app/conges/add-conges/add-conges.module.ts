import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCongesRoutingModule } from './add-conges-routing.module';
import { AddCongesComponent } from './add-conges.component';
import { AuthGuardService } from '../../shared/services/auth-guard.service';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { NavbarModule } from '../../navbar/navbar.module';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      console.log("Token", token);
      return token || '';
    },
    allowedDomains: [window.location.origin], // Dynamiquement obtenu
    disallowedRoutes: [`${window.location.origin}/conge`], // Dynamiquement obtenu
  };
}

@NgModule({
  declarations: [AddCongesComponent],
  imports: [
    CommonModule,
    AddCongesRoutingModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
      },
    }),
    NavbarModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [AuthGuardService],
})
export class AddCongesModule { }
