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
    UpdateFileModule
  ],
  providers:[BoxService, BreadcrumbService]
})
export class BoxModule { }
