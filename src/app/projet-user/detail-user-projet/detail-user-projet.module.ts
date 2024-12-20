import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailUserProjetComponent } from './detail-user-projet.component';
import { DetailUserProjetRoutingModule } from './detail-user-projet-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { FicheModule } from '../../projet/fiche/fiche.module';
import { IntervenantModule } from '../../projet/intervenant/intervenant.module';
import { ProjetsService } from '../../shared/services/projets.service';
import { DeleteProjetModule } from '../../projet/delete-projet/delete-projet.module';
import { BoxProjetModule } from '../../projet/box-projet/box-projet.module';
import { NavbarModule } from '../../navbar/navbar.module';
import { DevisProjetModule } from 'src/app/devis/devis-projet/devis-projet.module';
import { FactureProjetModule } from 'src/app/factures/facture-projet/facture-projet.module';
import { ChatProjetModule } from '../../chat-projet/chat-projet.module';
import { PreparationModule } from 'src/app/projet/preparation/preparation.module';
import { ModuleProjetModule } from 'src/app/projet/module-projet/module-projet.module';
import { PlanningProjetModule } from 'src/app/projet/planning-projet/planning-projet.module';



@NgModule({
  declarations: [DetailUserProjetComponent],
  imports: [
    CommonModule,
    DetailUserProjetRoutingModule,
    SharedModule,
    NavbarModule,
    FicheModule,
    IntervenantModule,
    DeleteProjetModule,
    BoxProjetModule,
    DevisProjetModule,
    FactureProjetModule,
    ChatProjetModule,
    PreparationModule,
    ModuleProjetModule,
    PlanningProjetModule
  ],
  providers:[ProjetsService]
})
export class DetailUserProjetModule { }
