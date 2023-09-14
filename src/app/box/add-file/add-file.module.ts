import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { BoxService } from '../../shared/services/box.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AddFileComponent } from './add-file.component';


@NgModule({
  declarations: [AddFileComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,ReactiveFormsModule
  ],
  providers:[BoxService],
  exports :[AddFileComponent]
})
export class AddFileModule { }
