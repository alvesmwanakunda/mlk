import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateHistoriqueComponent } from './update-historique.component';
import { EditorModule } from '@tinymce/tinymce-angular';



@NgModule({
  declarations: [UpdateHistoriqueComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    EditorModule
  ]
})
export class UpdateHistoriqueModule { }
