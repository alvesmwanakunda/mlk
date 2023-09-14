import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoxService } from '../../shared/services/box.service';
import { SharedModule } from '../../shared/shared.module';
import { DeleteFileComponent } from './delete-file.component';



@NgModule({
  declarations: [DeleteFileComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers:[BoxService]
})
export class DeleteFileModule { }
