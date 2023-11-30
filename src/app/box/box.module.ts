import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoxRoutingModule } from './box-routing.module';
import { BoxComponent } from './box.component';
import { SharedModule } from '../shared/shared.module';
import { NavbarModule } from '../navbar/navbar.module';
import { BoxService } from '../shared/services/box.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddDossierModule } from './add-dossier/add-dossier.module';
import { AddFileModule } from './add-file/add-file.module';
import { UpdateDossierModule } from './update-dossier/update-dossier.module';
import { DeleteDossierModule } from './delete-dossier/delete-dossier.module';
import { DeleteFileModule } from './delete-file/delete-file.module';
import { UpdateFileModule } from './update-file/update-file.module';
import { ViewerModule } from '../viewer/viewer.module';
import { BreadcrumbService } from '../shared/services/breadcrumb.service';
import { AuthGuardService } from '../shared/services/auth-guard.service';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { MoveFolderModule } from './move-folder/move-folder.module';

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      console.log("Token", token);
      return token || '';
    },
    allowedDomains: [window.location.origin], // Dynamiquement obtenu
    disallowedRoutes: [`${window.location.origin}/box`], // Dynamiquement obtenu
  };
}


@NgModule({
  declarations: [BoxComponent],
  imports: [
    CommonModule,
    BoxRoutingModule,
    SharedModule,
    NavbarModule,
    FormsModule,
    ReactiveFormsModule,
    AddDossierModule,
    AddFileModule,
    ViewerModule,
    UpdateDossierModule,
    DeleteDossierModule,
    DeleteFileModule,
    UpdateFileModule,
    MoveFolderModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
      },
    }),
  ],
  providers:[BoxService, BreadcrumbService,AuthGuardService]
})
export class BoxModule { }
