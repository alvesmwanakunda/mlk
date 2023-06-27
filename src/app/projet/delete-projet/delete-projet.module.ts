import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { DeleteProjetComponent } from './delete-projet.component';



@NgModule({
  declarations: [DeleteProjetComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers:[ProjetsService]
})
export class DeleteProjetModule { }
