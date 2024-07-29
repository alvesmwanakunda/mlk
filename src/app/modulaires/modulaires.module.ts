import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModulairesComponent } from './modulaires.component';
import { ModulairesRoutingModule } from './modulaires-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NavbarModule } from '../navbar/navbar.module';
import { DeleteModuleModule } from './delete-module/delete-module.module';
import { AuthGuardService } from '../shared/services/auth-guard.service';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { StockModuleModule } from './stock-module/stock-module.module';
import { PrepareModuleModule } from './prepare-module/prepare-module.module';
import { ReadyModuleModule } from './ready-module/ready-module.module';
import { SiteModuleModule } from './site-module/site-module.module';


export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      console.log("Token", token);
      return token || '';
    },
    allowedDomains: [window.location.origin], // Dynamiquement obtenu
    disallowedRoutes: [`${window.location.origin}/modulaires`], // Dynamiquement obtenu
  };
}


@NgModule({
  declarations: [ModulairesComponent],
  imports: [
    CommonModule,
    ModulairesRoutingModule,
    SharedModule,
    NavbarModule,
    DeleteModuleModule,
    StockModuleModule,
    PrepareModuleModule,
    ReadyModuleModule,
    SiteModuleModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
      },
    }),
  ],
  providers:[AuthGuardService]
})
export class ModulairesModule { }
