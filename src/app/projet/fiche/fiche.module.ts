import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FicheComponent } from './fiche.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProjetsService } from 'src/app/shared/services/projets.service';



@NgModule({
  declarations: [FicheComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[FicheComponent],
  providers:[ProjetsService]
})
export class FicheModule { }
