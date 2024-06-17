import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoriqueModuleComponent } from './historique-module.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeleteHistoriqueModule } from '../delete-historique/delete-historique.module';
import { UpdateHistoriqueModule } from '../update-historique/update-historique.module';
import { AngularEditorModule } from '@kolkov/angular-editor';





@NgModule({
  declarations: [HistoriqueModuleComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DeleteHistoriqueModule,
    UpdateHistoriqueModule,
    AngularEditorModule
  ],
  exports:[HistoriqueModuleComponent]
})
export class HistoriqueModuleModule { }
