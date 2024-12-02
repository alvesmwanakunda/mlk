import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DescriptionModuleRoutingModule } from './description-module-routing.module';
import { DescriptionModuleComponent } from './description-module.component';
import { SharedModule } from '../../shared/shared.module';
import { NavbarModule } from '../../navbar/navbar.module';
import { AuthGuardService } from '../../shared/services/auth-guard.service';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';


export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      console.log("Token", token);
      return token || '';
    },
    allowedDomains: [window.location.origin], // Dynamiquement obtenu
    disallowedRoutes: [`${window.location.origin}/modulaires/description/fiche`], // Dynamiquement obtenu
  };
}


@NgModule({
  declarations: [DescriptionModuleComponent],
  imports: [
    CommonModule,
    DescriptionModuleRoutingModule,
    SharedModule,
    NavbarModule,
    AngularEditorModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
      },
    }),
    FormsModule,
    ReactiveFormsModule
  ],
  providers:[AuthGuardService]
})
export class DescriptionModuleModule { }
