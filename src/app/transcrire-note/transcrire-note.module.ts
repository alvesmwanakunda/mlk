import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { TranscrireNoteComponent } from './transcrire-note.component';



@NgModule({
  declarations: [TranscrireNoteComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[TranscrireNoteComponent]
})
export class TranscrireNoteModule { }
