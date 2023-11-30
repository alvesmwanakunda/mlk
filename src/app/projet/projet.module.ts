import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjetRoutingModule } from './projet-routing.module';
import { ProjetComponent } from './projet.component';
import { SharedModule } from '../shared/shared.module';
import { NavbarModule } from '../navbar/navbar.module';
import { FicheModule } from './fiche/fiche.module';
import { IntervenantModule } from './intervenant/intervenant.module';
import { ProjetsService } from '../shared/services/projets.service';
import { DeleteProjetModule } from './delete-projet/delete-projet.module';
import { BoxProjetModule } from './box-projet/box-projet.module';
import { DevisProjetModule } from '../devis/devis-projet/devis-projet.module';
import { FactureProjetModule } from '../factures/facture-projet/facture-projet.module';


@NgModule({
  declarations: [ProjetComponent],
  imports: [
    CommonModule,
    ProjetRoutingModule,
    SharedModule,
    NavbarModule,
    FicheModule,
    IntervenantModule,
    DeleteProjetModule,
    BoxProjetModule,
    DevisProjetModule,
    FactureProjetModule
  ],
  providers:[ProjetsService]
})
export class ProjetModule { }
