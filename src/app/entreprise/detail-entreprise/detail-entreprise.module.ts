import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailEntrepriseRoutingModule } from './detail-entreprise-routing.module';
import { DetailEntrepriseComponent } from './detail-entreprise.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NavbarModule } from 'src/app/navbar/navbar.module';
//Test
import { FicheModule } from '../../projet/fiche/fiche.module';
import { IntervenantModule } from '../../projet/intervenant/intervenant.module';
//import { PieceModule } from '../../projet/piece/piece.module';
import { EntreprisesService } from 'src/app/shared/services/entreprises.service';
import { DeleteEntrepriseModule } from '../delete-entreprise/delete-entreprise.module';
import { ProjetEntrepriseModule } from '../projet-entreprise/projet-entreprise.module';


@NgModule({
  declarations: [DetailEntrepriseComponent],
  imports: [
    CommonModule,
    DetailEntrepriseRoutingModule,
    SharedModule,
    NavbarModule,
    FicheModule,
    IntervenantModule,
    //PieceModule,
    DeleteEntrepriseModule,
    ProjetEntrepriseModule
  ],
  providers:[EntreprisesService]
})
export class DetailEntrepriseModule { }
