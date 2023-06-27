import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabEntrepriseComponent } from './tab-entreprise.component';
import { EntreprisesService } from 'src/app/shared/services/entreprises.service';



@NgModule({
  declarations: [TabEntrepriseComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[TabEntrepriseComponent],
  providers:[EntreprisesService]
})
export class TabEntrepriseModule { }
