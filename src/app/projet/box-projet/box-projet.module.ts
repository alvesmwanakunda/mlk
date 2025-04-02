import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { BoxService } from '../../shared/services/box.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewerModule } from '../../viewer/viewer.module';
import { BreadcrumbService } from '../../shared/services/breadcrumb.service';
import { BoxProjetComponent } from './box-projet.component';
import { AddFolderModule } from './add-folder/add-folder.module';
import { UpdateDossierModule } from 'src/app/box/update-dossier/update-dossier.module';
import { DeleteDossierModule } from 'src/app/box/delete-dossier/delete-dossier.module';
import { UpdateFileModule } from 'src/app/box/update-file/update-file.module';
import { FileBoxModule } from './file-box/file-box.module';
import { DetailFolderModule } from './detail-folder/detail-folder.module';
import { MoveFolderProjetModule } from './move-folder-projet/move-folder-projet.module';
//import { DeleteFileProjetModule } from './delete-file-projet/delete-file-projet.module';



@NgModule({
  declarations: [BoxProjetComponent,],
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
    DetailFolderModule,
    MoveFolderProjetModule,
    //DeleteFileProjetModule
  ],
  exports:[BoxProjetComponent],
  providers:[BoxService, BreadcrumbService]
})
export class BoxProjetModule { }
