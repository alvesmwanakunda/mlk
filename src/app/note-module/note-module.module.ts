import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { NoteModuleRoutingModule } from './note-module-routing.module';
import { NoteModuleComponent } from './note-module.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AudioRecorderModule } from './audio-recorder/audio-recorder.module';
import { ImageAnnotationModule } from './image-annotation/image-annotation.module';
import { TranscrireNoteModule } from '../transcrire-note/transcrire-note.module';
import { DeleteNoteModuleModule } from './delete-note-module/delete-note-module.module';
import { UpdteNoteModuleModule } from './updte-note-module/updte-note-module.module';


@NgModule({
  declarations: [NoteModuleComponent],
  imports: [
    CommonModule,
    NoteModuleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AudioRecorderModule,
    ImageAnnotationModule,
    TranscrireNoteModule,
    DeleteNoteModuleModule,
    UpdteNoteModuleModule
  ],
  exports:[NoteModuleComponent]
})
export class NoteModuleModule { }
