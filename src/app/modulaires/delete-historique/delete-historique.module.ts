import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DeleteHistoriqueComponent } from './delete-historique.component';
import { ProjetsService } from 'src/app/shared/services/projets.service';



@NgModule({
  declarations: [DeleteHistoriqueComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers:[ProjetsService]
})
export class DeleteHistoriqueModule { }
