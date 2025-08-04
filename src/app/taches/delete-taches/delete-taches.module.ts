import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DeleteTachesComponent } from './delete-taches.component';



@NgModule({
  declarations: [DeleteTachesComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class DeleteTachesModule  { }
