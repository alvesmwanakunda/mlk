import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DevisProjetComponent } from './devis-projet.component';
import { ViewerStandarModule } from 'src/app/viewer-standar/viewer-standar.module';



@NgModule({
  declarations: [DevisProjetComponent],
  imports: [
    CommonModule,
    SharedModule,
    ViewerStandarModule
  ],
  exports:[DevisProjetComponent]
})
export class DevisProjetModule { }
