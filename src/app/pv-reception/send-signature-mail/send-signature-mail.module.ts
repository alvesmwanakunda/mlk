import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SendSignatureMailComponent } from './send-signature-mail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    SendSignatureMailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class SendSignatureMailModule { }
