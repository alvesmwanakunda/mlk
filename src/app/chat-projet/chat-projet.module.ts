import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatProjetComponent } from './chat-projet.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ChatProjetComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ChatProjetModule { }
