import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { DeleteFileProjetComponent } from './delete-file-projet.component';

@NgModule({
  declarations: [DeleteFileProjetComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [DeleteFileProjetComponent]
})
export class DeleteFileProjetModule { }
