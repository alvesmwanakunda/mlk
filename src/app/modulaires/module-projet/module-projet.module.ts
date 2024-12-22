import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleProjetComponent } from './module-projet.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewerStandarModule } from 'src/app/viewer-standar/viewer-standar.module';
import { DeleteModuleProjetModule } from 'src/app/projet/module-projet/delete-module-projet/delete-module-projet.module';
import { UpdateModuleProjetModule } from './update-module-projet/update-module-projet.module';


@NgModule({
  declarations: [ModuleProjetComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ViewerStandarModule,
    DeleteModuleProjetModule,
    UpdateModuleProjetModule
  ],
  exports:[ModuleProjetComponent]
})
export class ModuleProjetModule { }
