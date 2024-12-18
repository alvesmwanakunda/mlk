import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FicheTechniqueComponent } from './fiche-technique.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UpdateFicheTechniqueModule } from './update-fiche-technique/update-fiche-technique.module';



@NgModule({
  declarations: [FicheTechniqueComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule,
    SharedModule,
    UpdateFicheTechniqueModule
  ],
  exports: [FicheTechniqueComponent]
})
export class FicheTechniqueModule { }
