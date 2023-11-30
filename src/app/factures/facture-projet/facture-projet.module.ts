import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ViewerStandarModule } from 'src/app/viewer-standar/viewer-standar.module';
import { FactureProjetComponent } from './facture-projet.component';




@NgModule({
  declarations: [FactureProjetComponent],
  imports: [
    CommonModule,
    SharedModule,
    ViewerStandarModule
  ],
  exports:[FactureProjetComponent]
})
export class FactureProjetModule { }
