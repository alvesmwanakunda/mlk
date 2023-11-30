import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteDevisComponent } from './delete-devis.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [DeleteDevisComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class DeleteDevisModule { }
