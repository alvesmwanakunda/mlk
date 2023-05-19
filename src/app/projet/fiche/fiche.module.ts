import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FicheComponent } from './fiche.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [FicheComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[FicheComponent]
})
export class FicheModule { }
