import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateHistoriqueComponent } from './update-historique.component';
import { AngularEditorModule } from '@kolkov/angular-editor';



@NgModule({
  declarations: [UpdateHistoriqueComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule
  ]
})
export class UpdateHistoriqueModule { }
