import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { BoxService } from '../../../shared/services/box.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewerModule } from '../../../viewer/viewer.module';
import { BreadcrumbService } from '../../../shared/services/breadcrumb.service';
import { AddFolderModule } from '../add-folder/add-folder.module';
import { UpdateDossierModule } from 'src/app/box/update-dossier/update-dossier.module';
import { DeleteDossierModule } from 'src/app/box/delete-dossier/delete-dossier.module';
import { UpdateFileModule } from 'src/app/box/update-file/update-file.module';
import { FileBoxModule } from '../file-box/file-box.module';
import { DetailFolderComponent } from './detail-folder.component';
import { MoveFolderProjetModule } from '../move-folder-projet/move-folder-projet.module';
import { DeleteFileProjetModule } from '../delete-file-projet/delete-file-projet.module';


@NgModule({
  declarations: [DetailFolderComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ViewerModule,
    AddFolderModule,
    UpdateDossierModule,
    DeleteDossierModule,
    UpdateFileModule,
    FileBoxModule,
    MoveFolderProjetModule,
    DeleteFileProjetModule
  ],
  providers:[BoxService, BreadcrumbService],
  exports:[DetailFolderComponent]
})
export class DetailFolderModule { }
