import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ConfirmDialogComponent } from './confirm-dialog.component';



@NgModule({
  declarations: [ConfirmDialogComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[ConfirmDialogComponent]
})
export class ConfirmDialogModule { }
