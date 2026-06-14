import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoiceTaskComponent } from './voice-task.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [VoiceTaskComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class VoiceTaskModule { }
