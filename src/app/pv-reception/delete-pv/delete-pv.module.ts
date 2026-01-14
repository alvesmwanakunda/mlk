import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeletePvComponent } from './delete-pv.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [DeletePvComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[DeletePvComponent]
})
export class DeletePvModule { }
