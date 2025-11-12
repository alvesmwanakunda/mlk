import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DeleteNoteModuleComponent } from './delete-note-module.component';



@NgModule({
  declarations: [DeleteNoteModuleComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[DeleteNoteModuleComponent]
})
export class DeleteNoteModuleModule { }
