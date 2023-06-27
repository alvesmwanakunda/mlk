import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { ProjetEntrepriseComponent } from './projet-entreprise.component';




@NgModule({
  declarations: [ProjetEntrepriseComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers:[ProjetsService],
  exports :[ProjetEntrepriseComponent]
})
export class ProjetEntrepriseModule { }
