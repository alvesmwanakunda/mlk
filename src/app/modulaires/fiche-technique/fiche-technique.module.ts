import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FicheTechniqueComponent } from './fiche-technique.component';



@NgModule({
  declarations: [FicheTechniqueComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule
  ],
  exports: [FicheTechniqueComponent]
})
export class FicheTechniqueModule { }
