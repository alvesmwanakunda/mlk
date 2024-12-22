import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateModuleProjetComponent } from './update-module-projet.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [UpdateModuleProjetComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class UpdateModuleProjetModule { }
