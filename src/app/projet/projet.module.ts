import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjetRoutingModule } from './projet-routing.module';
import { ProjetComponent } from './projet.component';
import { SharedModule } from '../shared/shared.module';
import { NavbarModule } from '../navbar/navbar.module';
import { FicheModule } from './fiche/fiche.module';
import { IntervenantModule } from './intervenant/intervenant.module';
import { PieceModule } from './piece/piece.module';
import { EtudeModule } from './etude/etude.module';


@NgModule({
  declarations: [ProjetComponent],
  imports: [
    CommonModule,
    ProjetRoutingModule,
    SharedModule,
    NavbarModule,
    FicheModule,
    IntervenantModule,
    PieceModule,
    EtudeModule
  ]
})
export class ProjetModule { }
