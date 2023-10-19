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
    BoxProjetModule
  ],
  providers:[ProjetsService]
})
export class DetailUserProjetModule { }
