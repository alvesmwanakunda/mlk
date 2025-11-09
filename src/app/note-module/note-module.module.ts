import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { NoteModuleRoutingModule } from './note-module-routing.module';
import { NoteModuleComponent } from './note-module.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AudioRecorderModule } from './audio-recorder/audio-recorder.module';
import { ImageAnnotationModule } from './image-annotation/image-annotation.module';


@NgModule({
  declarations: [NoteModuleComponent],
  imports: [
    CommonModule,
    NoteModuleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AudioRecorderModule,
    ImageAnnotationModule
  ],
  exports:[NoteModuleComponent]
})
export class NoteModuleModule { }
