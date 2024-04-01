import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleProjetComponent } from './module-projet.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ModuleProjetComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[ModuleProjetComponent]
})
export class ModuleProjetModule { }
