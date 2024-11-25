import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleProjetComponent } from './module-projet.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewerStandarModule } from 'src/app/viewer-standar/viewer-standar.module';


@NgModule({
  declarations: [ModuleProjetComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ViewerStandarModule
  ],
  exports:[ModuleProjetComponent]
})
export class ModuleProjetModule { }
