import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailEntrepriseRoutingModule } from './detail-entreprise-routing.module';
import { DetailEntrepriseComponent } from './detail-entreprise.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NavbarModule } from 'src/app/navbar/navbar.module';
//Test
import { FicheModule } from '../../projet/fiche/fiche.module';
import { IntervenantModule } from '../../projet/intervenant/intervenant.module';
import { PieceModule } from '../../projet/piece/piece.module';


@NgModule({
  declarations: [DetailEntrepriseComponent],
  imports: [
    CommonModule,
    DetailEntrepriseRoutingModule,
    SharedModule,
    NavbarModule,
    FicheModule,
    IntervenantModule,
    PieceModule
  ]
})
export class DetailEntrepriseModule { }
