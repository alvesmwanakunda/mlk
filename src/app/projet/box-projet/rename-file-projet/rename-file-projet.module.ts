import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { RenameFileProjetComponent } from './rename-file-projet.component';

@NgModule({
  declarations: [RenameFileProjetComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [RenameFileProjetComponent]
})
export class RenameFileProjetModule { }
