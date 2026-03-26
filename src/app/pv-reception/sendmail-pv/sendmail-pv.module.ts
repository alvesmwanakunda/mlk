import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { SendmailPvComponent } from './sendmail-pv.component';

@NgModule({
  declarations: [SendmailPvComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [SendmailPvComponent]
})
export class SendmailPvModule { }
