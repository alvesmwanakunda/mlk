import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { BoxService } from '../../../shared/services/box.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileBoxComponent } from './file-box.component';



@NgModule({
  declarations: [FileBoxComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers:[BoxService],
  exports:[FileBoxComponent]
})
export class FileBoxModule { }
