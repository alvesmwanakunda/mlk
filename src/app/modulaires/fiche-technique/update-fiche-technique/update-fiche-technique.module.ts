import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { UpdateFicheTechniqueComponent } from './update-fiche-technique.component';





@NgModule({
  declarations: [UpdateFicheTechniqueComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [UpdateFicheTechniqueComponent]
})
export class UpdateFicheTechniqueModule { }
