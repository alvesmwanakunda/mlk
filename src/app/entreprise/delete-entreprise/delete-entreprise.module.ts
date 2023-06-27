import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteEntrepriseComponent } from './delete-entreprise.component';
import { EntreprisesService } from 'src/app/shared/services/entreprises.service';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [DeleteEntrepriseComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers:[EntreprisesService]
})
export class DeleteEntrepriseModule { }
