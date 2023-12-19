import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { PreparationComponent } from './preparation.component';



@NgModule({
  declarations: [PreparationComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[PreparationComponent],
  providers:[ProjetsService]
})
export class PreparationModule { }
