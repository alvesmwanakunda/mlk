import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { BreadcrumbService } from '../../shared/services/breadcrumb.service';
import { PlanProjetService } from '../../shared/services/plan-projet.service';
import { PlanProjetBoxComponent } from './plan-projet-box.component';
import { AddPlanFolderComponent } from './add-plan-folder/add-plan-folder.component';
import { PlanProjetUploadComponent } from './plan-projet-upload/plan-projet-upload.component';
import { DetailPlanFolderComponent } from './detail-plan-folder/detail-plan-folder.component';
import { UpdatePlanFolderComponent } from './update-plan-folder/update-plan-folder.component';
import { DeletePlanFolderComponent } from './delete-plan-folder/delete-plan-folder.component';
import { DeletePlanFileComponent } from './delete-plan-file/delete-plan-file.component';
import { ClassifyPlanFileComponent } from './classify-plan-file/classify-plan-file.component';
import { ValidatePlanFileComponent } from './validate-plan-file/validate-plan-file.component';

@NgModule({
  declarations: [
    PlanProjetBoxComponent,
    AddPlanFolderComponent,
    PlanProjetUploadComponent,
    DetailPlanFolderComponent,
    UpdatePlanFolderComponent,
    DeletePlanFolderComponent,
    DeletePlanFileComponent,
    ClassifyPlanFileComponent,
    ValidatePlanFileComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [PlanProjetBoxComponent],
  providers: [PlanProjetService, BreadcrumbService]
})
export class PlanProjetBoxModule {}
